import { LLMClient } from "../services/LLMclient";
import Tools from "../services/tools"
import GeminiEmbeddings from "./Embeddings";
import FetchWithRetry from "../utils/RetryingMechanism";
import GenerateContext from "./GetContext";
import { SystemPrompts } from "../utils/systemPrompts";
import type { WebSocket } from "ws";
import MessagesTypes from "../messages";
import { prisma } from "@workspace/db/"
import queue from "@workspace/queue";
interface ToolsResultsType {
    name: string,
    result: any
}

interface MessageOutput {
    type: "output";
    message: string;
    completeInfo: string;
    nextMessage: string;
    importantNoteToUser: string | null;
    importantNoteToServer: string | null;
    stopNow: boolean;
}

interface FunctionCalling {
    type: "function_call";
    name: string;
    arguments: Record<string, any> | null;
}

type LLMOutput = Array<MessageOutput | FunctionCalling>;


async function SafeParsing<T>(text: string) {
    try {
        return JSON.parse(text) as T;
    } catch (error) {
        return null;
    }
}


async function LLMCall(ChatId: string, Message: string, ToolsResult: ToolsResultsType | null, ws: WebSocket) {
    const maxRetries = 25;
    let currAttempt = 0;
    let nextStepMessage = "";
    let status: boolean = false;
    while (currAttempt <= maxRetries && !status) {
        try {
            const qVector = await GeminiEmbeddings.embedQuery(Message);
            const Context = await GenerateContext(ChatId, qVector);
            const response = await FetchWithRetry(() => LLMClient.responses.create({
                model: "qwen/qwen3-235b-a22b:free",
                input: [
                    {
                        role: "system",
                        content: `${SystemPrompts.Base}`
                    },
                    {
                        role: "system",
                        content: `${SystemPrompts.Agent}`
                    },
                    {
                        role: "assistant",
                        content: `Relevant context retrieved from vector Db for chat ${ChatId} :\n ${Context}`
                    },
                    ...(nextStepMessage ? [{
                        role: "assistant",
                        content: `Previous agent state : \n ${nextStepMessage}`
                    }] : []),
                    {
                        role: "system",
                        content: `Results from tools executed in the previous step \n ${JSON.stringify(ToolsResult)}`
                    },
                    {
                        role: "user",
                        content: Message
                    }
                ] as any,
                tools: Tools as any
            }))

            if (!response) {
                continue;
            }
            console.log("Response from api :: ", response.output, response.output_text);
            const parsedOutput = await SafeParsing<LLMOutput>(response.output_text);
            if (!parsedOutput) {
                continue;
            }

            for (const output of parsedOutput) {
                if (output.type === "output") {
                    const { message, nextMessage, completeInfo, importantNoteToServer, importantNoteToUser, stopNow } = output;
                    ws.send(JSON.stringify({
                        type: MessagesTypes.USER_UPDATE,
                        payload: {
                            data: {
                                update: message,
                                message: completeInfo,
                                importantNoteToUser: importantNoteToUser
                            }
                        }
                    }));
                    nextStepMessage = nextMessage;
                    status = stopNow
                    void (async () => {
                        try {
                            const savedMsg = await prisma.messages.create({
                                data: {
                                    chat: { connect: { id: ChatId } },
                                    content: completeInfo,
                                    type: "Recieve",
                                },
                            });
                            await queue.add(`llmmessage/${ChatId}/${savedMsg.id}`, {
                                completeInfo,
                            });
                        } catch (error) {
                            console.error("DB or Queue Error:", error);
                            ws.send(
                                JSON.stringify({
                                    type: MessagesTypes.INTERNAL_SERVER_ERROR,
                                })
                            );
                        }
                    })();

                }
            }

        } catch (error) {
            console.error("Agent Error:", error);
            ws.send(JSON.stringify({
                chatId: ChatId,
                error: "Agent crashed or returned invalid JSON"
            }));
        }
    }
}

export default LLMCall