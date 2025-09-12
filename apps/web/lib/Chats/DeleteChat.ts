import { NextResponse, NextRequest } from "next/server"
import Response from "../Utils/Response"
import { prisma } from "@workspace/db/*"
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "../Auth/auth_Config";

const DeleteChat = async (req: NextRequest) => {
    const curruser = await getServerSession(NEXT_AUTH_CONFIG);
    if (!curruser || !curruser.user) {
        return NextResponse.json(new Response(404, "Unauthorized to create a chat session ", {}), { status: 404 });
    }
    const user = curruser.user as { id: string, email: string, username: string, profile: string, Account: string }
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json(new Response(404, "Please provide id of chat to delete", {}))
    }

    try {
        const deleteChat = await prisma.chats.delete({
            where: {
                id: id,
                user: {
                    id: user.id
                }
            }
        })

        return NextResponse.json(new Response(201, "All Chats ", deleteChat), { status: 201 });

    } catch (error) {
        const errMsg = error instanceof Error ? (error.stack || error.message) : String(error);
        console.error("Error on creating chat", errMsg);
        const safeErrorPayload = (error && typeof error === 'object') ? { ...(error as any) } : { message: String(error) };

        return NextResponse.json(new Response(500, "Internal Server Error", { error: safeErrorPayload }), { status: 500 });

    }
}

export default DeleteChat;