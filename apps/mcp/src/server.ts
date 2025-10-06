import { server } from './mcp';
import { Response } from "./utils";
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { PORT } from './config';
import "./config"
import './tools'


const app = express();
app.use(express.json());



app.post('/mcp', async (req, res): Promise<any> => {
    try {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true
        });

        res.on('close', () => {
            transport.close();
        });

        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error("Error in the mcp call",error)
        return res.status(500).json(new Response(500,"Internal server error",{}))

    }
});


app.listen(PORT, () =>{
    console.log("MCP Server running on port number :: ", PORT);
})


