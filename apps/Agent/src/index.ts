import express from "express"
import http from "http";
import { WebSocketServer } from "ws"
import { LocalPubSub } from "./sessionStoreManager";
import cors from "cors";
import validateConfig from "./config";
import { ChatSessionManager } from "./services/ChatSession";
import MessagesTypes from "./messages";
import LLMRouter from "./routes/llm.routes"
import { PORT } from "./config";
import { prisma } from "@workspace/db/";

validateConfig();

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });


wss.on("connection", (ws) => {
    console.log("New user connected to LLM socket server");
    ws.send(JSON.stringify({
        type: "RECIEVED",
        payload: {
            data: "ACCEPTED NEW CONNECTION"
        }
    }))
    ws.on("message", async (data) => {
        try {
            const message = JSON.parse(data.toString());
            const { type, payload } = message;
            let userId: string;

            if (type == MessagesTypes.INIT_CHAT_SESSION) {
                const { chatId } = payload.data
                if (!chatId) {
                    return ws.send(JSON.stringify({
                        type: MessagesTypes.INVALID_REQUEST,
                        payload: {
                            data: {
                                message: "Please provide chatId"
                            }
                        }
                    }))
                }
                try {
                    const user = await prisma.chats.findFirst({
                        where: {
                            id: chatId
                        },
                        select: {
                            user: true
                        }
                    });
                    if(!user) {
                        throw Error("Invalid ChatId. It doesn't exist.")
                    }
                    userId = user.user.id;

                } catch (error) {
                    throw Error("Invalid ChatId. It doesn't exist.")
                }
                const session = new ChatSessionManager(chatId, ws,userId)
                if (LocalPubSub.has(chatId)) {
                    LocalPubSub.get(chatId)?.CloseServer();
                }
                LocalPubSub.set(chatId, session)
                ws.send(JSON.stringify({
                    type: MessagesTypes.INITIATED_SESSION,
                    payload: {
                        data: {}
                    }
                }))


            }

        } catch (error) {
            console.error(error);
            ws.send(JSON.stringify({
                type: MessagesTypes.INVALID_REQUEST,
                payload: {
                    data: {
                        message: "INTERNAL SERVER ERROR"
                    }
                }
            }))

        }
    })
});



app.use(cors({
    origin: ["http://localhost:5000"]
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use('/healthz', (req, res): any => {
    return res.status(200).send("OK");
})
app.use('/llm', LLMRouter)

server.listen(PORT, () => {
    console.log(`LLM http and ws server running on ${PORT}`);
})




