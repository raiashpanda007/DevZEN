import { LLMClient } from "./LLMclient";
import { mcpClient } from "./McpClient";
async function CreateProject (message:string,userId:string) {
    const client = await mcpClient('http://localhost:5004/mcp')
}

export {
    CreateProject
}