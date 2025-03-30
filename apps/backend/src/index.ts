import { WebSocketServer } from "ws";
import { DIR_FETCH, MESSAGE_INIT } from "@workspace/types";
import { getRootFilesandFolders } from "./awsS3files";
import { fetchDir } from "./filesSystem";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection",  (ws) => {
    console.log("New WebSocket connection established");


    
    ws.send("Hello! WebSocket connection is successful.");




    ws.on("message", async (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log("Received message", message);

            if (message.type === MESSAGE_INIT) {
                const projectId = message.payload.projectId;
                if (!projectId) {
                    ws.send(JSON.stringify({ type: "error", payload: "Project ID is required" }));
                    return;
                }
                await getRootFilesandFolders(`code/${projectId}`, `./workspace/${projectId}`);
                const dirs = await fetchDir(``, '');
                ws.send(JSON.stringify({ type: "success", payload: {
                    message: "Project initialized successfully",
                    dirs: dirs,
                } }));
            } else if(message.type === DIR_FETCH) {
                const {dir} = message.payload;
                if(!dir) {
                    ws.send(JSON.stringify({ type: "error", payload: "Directory is required" }));
                    return;
                }
                const dirs = await fetchDir(`/workspace/${dir}`, `/${dir}`);
                ws.send(JSON.stringify({ type: "dir_fetch", payload: dirs }));

            }
        } catch (err) {
            console.error("Error parsing WebSocket message:", err);
            ws.send(JSON.stringify({ type: "error", payload: "Invalid message format" }));
        }
    });
});

console.log(`📡 WebSocket server running on ws://localhost:${PORT}`);
