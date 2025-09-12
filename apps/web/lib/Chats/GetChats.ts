import { NextResponse, NextRequest } from "next/server"
import Response from "../Utils/Response"
import { prisma } from "@workspace/db/*"
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "../Auth/auth_Config";

const GetAllChats = async (req: NextRequest) => {
    const curruser = await getServerSession(NEXT_AUTH_CONFIG);
    if (!curruser || !curruser.user) {
        return NextResponse.json(new Response(404, "Unauthorized to create a chat session ", {}), { status: 404 });
    }
    const user = curruser.user as { id: string, email: string, username: string, profile: string, Account: string }

    try {
        const allChats = await prisma.chats.findMany({
            where: {
                user: {
                    id: user.id
                }
            },select:{
                id:true,
                name:true,
                mode:true,
            }
        })

        return NextResponse.json(new Response(201, "All Chats ", allChats), { status: 201 });

    } catch (error) {
        const errMsg = error instanceof Error ? (error.stack || error.message) : String(error);
        console.error("Error on creating chat", errMsg);
        const safeErrorPayload = (error && typeof error === 'object') ? { ...(error as any) } : { message: String(error) };

        return NextResponse.json(new Response(500, "Internal Server Error", { error: safeErrorPayload }), { status: 500 });

    }
}

export default GetAllChats;