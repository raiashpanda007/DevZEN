import { NextResponse, NextRequest } from "next/server";
import Response from "../../Utils/Response";
import { prisma } from "@workspace/db";
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "../../Auth/auth_Config";
import axios from "axios";


const DeleteProject = async (req: NextRequest) => {
    console.log("Delete Project");
    const curUser = await getServerSession(NEXT_AUTH_CONFIG);
    if (!curUser || !curUser.user) {
        return NextResponse.redirect('/auth/signin')
    }
    const user = curUser.user as { id: string, email: string, username: string, profile: string, Account: string }

    const body = await req.json();

    const { projectId } = body;

    if (!projectId) {
        return NextResponse.json(new Response(400, "Project ID is required", {}), { status: 400 })
    }


    try {
        const project = await prisma.projects.findUnique({
            where: {
                id: projectId,
                userId: user.id
            }
        })

        if (!project) {
            return NextResponse.json(new Response(400, "Project not found", {}), { status: 400 })
        }

        await prisma.projects.delete({
            where: {
                id: projectId
            }
        })

        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL_SERVER}/project`, {
            data: {
                projectId: projectId,
                
            }

        })

        return NextResponse.json(new Response(200, "Project deleted successfully", {}), { status: 200 })

    } catch (error) {
        console.log("Error deleting project", error);
        return NextResponse.json(new Response(500, "Error deleting project", { error }), { status: 500 })

    }

}

export default DeleteProject