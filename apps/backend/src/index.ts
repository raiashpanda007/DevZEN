import { WebSocketServer } from "ws";
import { MESSAGE_INIT } from "@workspace/types";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");

    ws.send("Hello! WebSocket connection is successful.");

    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log("Received message", message);

            if (message.type === MESSAGE_INIT) {
                const projectId = message.payload.projectId;
                if (!projectId) {
                    ws.send(JSON.stringify({ type: "error", payload: "Project ID is required" }));
                    return;
                }
                // TODO: Fetch base project files and transfer to client
                ws.send(JSON.stringify({ type: "success", payload: "Project files will be sent." }));
            }
        } catch (err) {
            console.error("Error parsing WebSocket message:", err);
            ws.send(JSON.stringify({ type: "error", payload: "Invalid message format" }));
        }
    });
});

console.log(`📡 WebSocket server running on ws://localhost:${PORT}`);
