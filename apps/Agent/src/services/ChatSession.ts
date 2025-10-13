import { WebSocket } from "ws";
import MessagesTypes from "../messages";
import { z as zod } from "zod";
import queue from "@workspace/queue"
import { prisma } from "@workspace/db/"

const PromptMessageSchema = zod.object({
    chatID:zod.string(),
    message: zod.string().min(1).max(1000),
    messageFiles: zod.array(
        zod.object({
            path: zod.string(),
            fileName:zod.string()
        })
    ).optional()
})

export class ChatSessionManager {
    public id: string
    public ws: WebSocket

    constructor(id: string, ws: WebSocket) {
        this.id = id;
        this.ws = ws
        this.Messagehandler()
    }

    private async Messagehandler() {
        this.ws.on("message", async (data) => {
            const message = JSON.parse(data.toString());
            const { type, payload } = message
            switch (type) {
                case MessagesTypes.PROMPT:
                    try {
                        const parseData = PromptMessageSchema.safeParse(payload.data);
                        if (!parseData.success) {
                            return this.ws.send(JSON.stringify({
                                type: MessagesTypes.INVALID_REQUEST,
                                paylaod: {
                                    data: {
                                        message: "Please provide valid prompt with proper structure"
                                    }
                                }
                            }))
                        }
                        const {message,chatID} = parseData.data;

                        const messageSaved = await prisma.messages.create({
                            data:{
                                content:message,
                                type:"Send",
                                chat:{
                                    connect:{
                                        id:this.id
                                    }
                                }
                            }
                        })
                        await queue.add(`usermessage/${chatID}/${messageSaved.id}`,{
                            message
                        })
                        console.log("Saved user message in redis")




                        break;
                    } catch (error) {
                        return this.ws.send(JSON.stringify({
                            type: MessagesTypes.INVALID_REQUEST,
                            payload: {
                                data: {
                                    message: "INTERNAL SERVER ERROR"
                                }
                            }
                        }))
                    }

                default:
                    break;
            }
        })
    }
}