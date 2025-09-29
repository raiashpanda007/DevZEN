import { asyncHandler, Response } from "../utils";
import { prisma } from "@workspace/db/"
import {z as zod} from "zod"

const SendMessageSchema = zod.object({
    chatId:zod.string().min(2)
})
const SendMessage = asyncHandler(async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Unable to save message")
    }

  
})