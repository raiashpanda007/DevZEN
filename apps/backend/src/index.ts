import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("socket server started");
  ws.send("Hello! I am a WebSocket server.");
});