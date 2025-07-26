import { WebSocketServer } from "ws";
import { Messages } from "@workspace/types";
import { getRootFilesandFolders, uploadAllProjectsFromWorkspace } from "./awsS3files";
import { fetchAllDirs, fetchFileContent, CRUD_operations, saveFileContent } from "./filesSystem";
import { TerminalManager } from "./pty";
import { v4 as uuidv4 } from 'uuid';


const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });
const terminal = new TerminalManager();
const randomUUID = uuidv4();
wss.on("connection", (ws) => {

    const {
        MESSAGE_INIT,
        DIR_FETCH,
        FILE_FETCH,
        RECEIVED_DIR_FETCH,
        RECEIVED_INIT_DIR_FETCH,
        RECIEVED_FILE_FETCH,
        MESSAGE_CREATE_FILE,
        MESSAGE_DELETE_FILE,
        MESSAGE_CREATE_FOLDER,
        MESSAGE_DELETE_FOLDER,
        MESSAGE_RENAME_FOLDER,
        MESSAGE_RENAME_FILE,
        MESSAGE_SAVE_FILE_CONTENT,
        MESSAGE_REQUEST_TERMINAL,
        MESSAGE_UPDATE_TERMINAL


    } = Messages;
    console.log("New WebSocket connection established");

    ws.send(JSON.stringify({ type: "connected", payload: "WebSocket connection established" }));
    ws.on("close", async () => {
        console.log("uploading data to s3")
        terminal.clear(randomUUID)
        await uploadAllProjectsFromWorkspace();
    })
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
                        payload: { dirs }
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
                    console.log("Fetching file content for path:", filePath);
                    if (!filePath) {
                        ws.send(JSON.stringify({ type: "error", payload: { message: "Improper file path" } }));
                        return;
                    }
                    const content = await fetchFileContent(`./${filePath}`);
                    if (content == undefined) {
                        ws.send(JSON.stringify({ type: "Failure", payload: { message: "File not found" } }));
                        return;
                    }




                    ws.send(JSON.stringify({
                        type: RECIEVED_FILE_FETCH,
                        payload: { message: "File fetched successfully", content }
                    }));
                    break;
                }

                case MESSAGE_CREATE_FILE: {
                    console.log("Creating file");
                    const { path, name } = message.payload;
                    if (!path || !name) {
                        ws.send(JSON.stringify({ type: "error", payload: "File name and parent ID are required to create a new file" }));

                        return;
                    }
                    await CRUD_operations.createNewFile(path, name);
                    const projectID = path.split("workspace/")[1].split("/")[0];
                    const dirs = await fetchAllDirs(`/workspace/${projectID}`);
                    wss.clients.forEach((client) => {
                        if (client.readyState === client.OPEN) {
                            client.send(JSON.stringify({
                                type: RECEIVED_INIT_DIR_FETCH,
                                payload: { message: "File created successfully", dirs }
                            }))
                        }
                    })
                    break;
                }
                case MESSAGE_CREATE_FOLDER: {
                    console.log("Creating folder");
                    const { path, name } = message.payload;
                    if (!path || !name) {
                        ws.send(JSON.stringify({ type: "error", payload: "Folder name and parent ID are required to create a new folder" }));
                        return;
                    }
                    await CRUD_operations.createNewFolder(path, name);
                    const projectID = path.split("workspace/")[1].split("/")[0];
                    const dirs = await fetchAllDirs(`/workspace/${projectID}`);
                    wss.clients.forEach((client) => {
                        if (client.readyState === client.OPEN) {
                            client.send(JSON.stringify({
                                type: "success_crud",
                                payload: { message: "Folder created successfully", dirs }
                            }))
                        }
                    })
                    break;
                }
                case MESSAGE_DELETE_FILE: {
                    console.log("Deleting file");

                    const { path } = message.payload;
                    if (!path) {
                        ws.send(JSON.stringify({ type: "error", payload: "File path is required to delete a file" }));
                        return;
                    }
                    const NewPath = path.endsWith("/") ? path.slice(0, -1) : path;
                    await CRUD_operations.Delete(NewPath);
                    const projectID = path.split("workspace/")[1].split("/")[0];
                    const dirs = await fetchAllDirs(`/workspace/${projectID}`);
                    wss.clients.forEach((client) => {
                        if (client.readyState === client.OPEN) {
                            client.send(JSON.stringify({
                                type: "success_crud",
                                payload: { message: "File deleted successfully", dirs }
                            }))
                        }
                    })
                    break;
                }
                case MESSAGE_DELETE_FOLDER: {
                    console.log("Deleting folder");
                    console.log(message)
                    const { path } = message.payload;
                    if (!path) {
                        ws.send(JSON.stringify({ type: "error", payload: "Folder path is required to delete a folder" }));
                        return;
                    }
                    const NewPath = path.endsWith("/") ? path : `${path}/`;
                    await CRUD_operations.Delete(NewPath);
                    const projectID = path.split("workspace/")[1].split("/")[0];
                    const dirs = await fetchAllDirs(`/workspace/${projectID}`);
                    wss.clients.forEach((client) => {
                        if (client.readyState === client.OPEN) {
                            client.send(
                                JSON.stringify({
                                    type: "success_crud",
                                    payload: { message: "Folder deleted successfully", dirs }
                                })
                            )
                        }
                    })
                    break;
                }
                case MESSAGE_RENAME_FOLDER: {
                    console.log("Renaming folder");
                    const { path, name } = message.payload;
                    if (!path || !name) {
                        ws.send(JSON.stringify({ type: "error", payload: "Folder path and new name are required to rename a folder" }));
                        return;
                    }
                    await CRUD_operations.renameFolder(path, name);
                    const projectID = path.split("workspace/")[1].split("/")[0];
                    const dirs = await fetchAllDirs(`/workspace/${projectID}`);
                    wss.clients.forEach((client) => {
                        if (client.readyState === client.OPEN) {
                            client.send(JSON.stringify({
                                type: "success_crud",
                                payload: { message: "Folder renamed successfully", dirs }
                            }))
                        }
                    })
                    break;
                }

                case MESSAGE_RENAME_FILE: {
                    console.log("Renaming file");
                    const { path, name } = message.payload;
                    if (!path || !name) {
                        ws.send(JSON.stringify({ type: "error", payload: "File path and new name are required to rename a file" }));
                        return;
                    }
                    await CRUD_operations.renameFile(path, name);
                    const projectID = path.split("workspace/")[1].split("/")[0];
                    const dirs = await fetchAllDirs(`/workspace/${projectID}`);
                    wss.clients.forEach((client) => {
                        if (client.readyState === client.OPEN) {
                            client.send(JSON.stringify({
                                type: "success_crud",
                                payload: { message: "File renamed successfully", dirs }
                            }))
                        }
                    })
                    break;
                }
                case MESSAGE_SAVE_FILE_CONTENT: {
                    console.log("File saved", message.payload);
                    const { content, filePath } = message.payload;
                    try {

                        const fileupdate = await saveFileContent(filePath, content)
                        console.log("File update ", filePath)

                    } catch (error) {
                        console.error("error in storing file info on server")
                    }
                    break;
                }
                case MESSAGE_REQUEST_TERMINAL: {
                    const { projectId } = message.payload;
                    if (!projectId) {
                        ws.send(
                            JSON.stringify({
                                type: 'Error',
                                payload: 'Please provide projectId for creating terminal'
                            })
                        )
                        break;
                    }
                    terminal.createPty(randomUUID, projectId, (data, pid) => {
                        ws.send(JSON.stringify({ type: 'terminal:data', data: Buffer.from(data, 'utf-8').toString('utf-8'), pid }));
                    })
                    console.log("Terminal started and working");
                    break;
                }
                case MESSAGE_UPDATE_TERMINAL: {
                    const { data } = message.payload;
                    if (!data) {
                        ws.send(JSON.stringify({
                            type: "Error",
                            payload: "Please provide data "
                        }))
                        break;
                    }
                    terminal.write(randomUUID, data);
                    console.log("Updated terminal");
                    break;
                }
                default: {
                    ws.send(JSON.stringify({ type: "error", payload: "Unknown message type" }));
                    break;
                }

            }

        } catch (err) {
            console.error("Error parsing WebSocket message:", err);
            ws.send(JSON.stringify({ type: "error", payload: "Invalid message format" }));
        }
    });
});

console.log(`📡 WebSocket server running on ws://localhost:${PORT}`);
wss.on("close", () => {
    console.log("WebSocket connection closed and cleaning terminal");
    terminal.clear(randomUUID);
});
wss.on("error", (error) => {
    console.error("WebSocket error:", error);
}
);