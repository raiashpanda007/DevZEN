import { LLMClient } from "./LLMclient";
import { MCPClient } from "./McpClient";
import { MCP_SERVER_URL } from "../config";
async function CreateProject(message: string, userId: string) {

    try {
        if (!MCP_SERVER_URL) throw new Error("Please provide mcp server url");
        const client = await MCPClient(MCP_SERVER_URL);
        const llmresponse = await LLMClient.chat.completions.create({
            model: "qwen/qwen3-coder:free",
            messages: [
                {
                    role: "system",
                    content: ""
                }
            ]
        })
    } catch (error) {
        console.error("Unable to connect to mcp server for creating project")
    }
}

export {
    CreateProject
}