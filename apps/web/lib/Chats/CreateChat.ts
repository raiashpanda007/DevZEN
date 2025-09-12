import { NextResponse, NextRequest } from "next/server"
import Response from "../Utils/Response"
import { prisma } from "@workspace/db/*"
import { z as zod } from "zod";
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "../Auth/auth_Config";

const CreateChatSchema = zod.object({
    name: zod.string(),
    projectId: zod.string().optional(),
    mode: zod.enum(['Agent', 'Edit', 'Review'])
});

const CreateChat = async (req: NextRequest) => {
    const curruser = await getServerSession(NEXT_AUTH_CONFIG);
    if (!curruser || !curruser.user) {
        return NextResponse.json(new Response(404, "Unauthorized to create a chat session ", {}), { status: 404 });
    }
    const user = curruser.user as { id: string, email: string, username: string, profile: string, Account: string }
    const body = await req.json();
    console.log("Body to create chat", body);
    const parsedBody = CreateChatSchema.safeParse(body);
    if (!parsedBody.success) {
        return NextResponse.json(new Response(404, "Invalid Data to create new Chat session", { error: parsedBody.error.errors }), { status: 401 });
    }
    const { name, mode, projectId } = parsedBody.data;

    if (mode != "Agent" && !projectId) {
        return NextResponse.json(new Response(401, "Please provide project too for using modes other than Agent mode", {}), { status: 404 });
    }
    try {
        const chatData: any = {
            name: name,
            mode: mode,
            user: {
                connect: {
                    id: user.id
                }
            }
        };
        if (projectId) {
            chatData.project = {
                connect:{
                    id:projectId
                }
            };
        }
        console.log("--------------------CHATDATA :: ---------------------------",chatData);
        const createChat = await prisma.chats.create({
            data: chatData
        })
        return NextResponse.json(new Response(201, "Created Chat ", createChat));

    } catch (error) {

        const errMsg = error instanceof Error ? (error.stack || error.message) : String(error);
        console.error("Error on creating chat", errMsg);
        const safeErrorPayload = (error && typeof error === 'object') ? { ...(error as any) } : { message: String(error) };

        return NextResponse.json(new Response(500, "Internal Server Error", { error: safeErrorPayload }), { status: 500 });
    }
}

export default CreateChat