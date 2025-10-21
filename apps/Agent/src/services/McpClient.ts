import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"

export async function mcpClient(url: string) {
    const transport = new StreamableHTTPClientTransport(new URL(url));
    const client = new Client({
        name:"ashna-agentapp-client",
        version:"1.0.0"
    })
    await client.connect(transport);
    console.log(await client.listTools());
}