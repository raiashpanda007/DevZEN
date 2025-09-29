import express from "express"
import http from "http";
import { WebSocketServer } from "ws"
import cors from "cors";
import { PORT } from "./config";


const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });

app.use(cors({
    origin:["http://localhost:5000"]
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


server.listen(PORT, () => {
    console.log(`MCP http and ws server running on ${PORT}`);
})

