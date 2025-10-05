// TODO:1. first check that project exist or not 
// TODO:2. not then create the project and save the message in db.
// TODO:3. check project pod is running or not , if not then run it or if resources are full then show try after sometime
// TODO:4. then generate embeddings
// TODO:5 then llm and mcp call.


import { asyncHandler, Response } from "../utils";
import queue from "@workspace/queue"
import axios from "axios";
import { prisma } from "@workspace/db/"
import { z as zod } from "zod"

const MessageSchema = zod.object({
    chatId: zod.string(),
    message: zod.string().min(1).max(1000),
    messageFiles: zod.array(
        zod.object({
            path: zod.string()
        })
    ).optional()
})
export const SendMessage = asyncHandler(async (req, res) => {

    const body = req.body;
    const parsedBody = MessageSchema.safeParse(body);
    if (!parsedBody.success) {
        return res.status(401).json(new Response(401, "Please provide complete info of project", {}));
    }
    const { chatId } = parsedBody.data

    // Check project is related to this or not

    const project = await prisma.chats.findFirst({
        where: {
            id: chatId
        }, 
        include: {
            project: true
        }
    });
    if(!project || !project.projectId) {
        // create project 

    }



})