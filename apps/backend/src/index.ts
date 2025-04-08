import { WebSocketServer } from "ws";
import { DIR_FETCH, MESSAGE_INIT, FILE_FETCH,RECIEVED_FILE_FETCH, RECEIVED_INIT_DIR_FETCH, RECEIVED_DIR_FETCH } from "@workspace/types";
import { getRootFilesandFolders } from "./awsS3files";
import { fetchAllDirs, fetchFileContent } from "./filesSystem";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");

    ws.send(JSON.stringify({ type: "connected", payload: "WebSocket connection established" }));

    ws.on("message", async (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log("Received message", message);

            switch (message.type) {
                case MESSAGE_INIT: {
                    const projectId = message.payload.projectId;
                    if (!projectId) {
                        ws.send(JSON.stringify({ type: "error", payload: "Project ID is required" }));
                        return;
                    }
                    await getRootFilesandFolders(`code/${projectId}`, `./workspace/${projectId}`);
                    const dirs = await fetchAllDirs(`/workspace/${projectId}`);
                    ws.send(JSON.stringify({ 
                        type: RECEIVED_INIT_DIR_FETCH, 
                        payload: {dirs }
                    }));
                    break;
                }

                case DIR_FETCH: {
                    const { dir } = message.payload;
                    
                    const dirs = await fetchAllDirs(`/workspace/${dir}`);
                    ws.send(JSON.stringify({ type: RECEIVED_DIR_FETCH, payload: dirs }));
                    break;
                }

                case FILE_FETCH: {
                    const filePath = message.payload.path;
                    if (!filePath) {
                        ws.send(JSON.stringify({ type: "error", payload: { message: "Improper file path" }}));
                        return;
                    }
                    const content = await fetchFileContent(`./${filePath}`);
                    if (!content) {
                        ws.send(JSON.stringify({ type: "Failure", payload: { message: "File not found" }}));
                        return;
                    }

                    console.log("File content:", content);

                    ws.send(JSON.stringify({ 
                        type: RECIEVED_FILE_FETCH, 
                        payload: { message: "File fetched successfully", content }
                    }));
                    break;
                }

                default:
                    ws.send(JSON.stringify({ type: "error", payload: "Unknown message type" }));
                    break;
            }
        } catch (err) {
            console.error("Error parsing WebSocket message:", err);
            ws.send(JSON.stringify({ type: "error", payload: "Invalid message format" }));
        }
    });
});

console.log(`📡 WebSocket server running on ws://localhost:${PORT}`);
wss.on("close", () => {
    console.log("WebSocket connection closed");
});
wss.on("error", (error) => {
    console.error("WebSocket error:", error);
}
);