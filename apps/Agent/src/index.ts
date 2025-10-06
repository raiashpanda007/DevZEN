import express from "express"
import http from "http";
import { WebSocketServer } from "ws"
import cors from "cors";
import validateConfig from "./config";
import MessageRouter from "./routes/message.routes"

import { PORT } from "./config";

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
})


app.use(cors({
    origin: ["http://localhost:5000"]
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use('/message',MessageRouter)

server.listen(PORT, () => {
    console.log(`LLM http and ws server running on ${PORT}`);
})




