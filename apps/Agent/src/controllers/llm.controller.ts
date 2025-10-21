import { asyncHandler, Response } from "../utils";
import { z as zod } from "zod"
import { LocalPubSub } from "../sessionStoreManager";
const LLMRequestSchema = zod.object({
    chatId: zod.string(),
    messageId: zod.string(),
    context: zod.string(),
    message: zod.string()
})
export const LLMRequest = asyncHandler(async (req, res) => {
    const parsedBody = LLMRequestSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json(new Response(400, " Please provide vallid data ", {
            error: parsedBody.error
        }))
    }
    const { chatId, message, messageId, context } = parsedBody.data;

    const session = LocalPubSub.get(chatId);
    if(!session) {
        return res.status(500).json(new Response(500," Internal Server Error ", {}));
    }

    await session.AgentCall(message,messageId,chatId,context);
    console.log("Agent called with tools");
    return res.status(200).json(new Response(200, "Send agent call", {}))
    
})


