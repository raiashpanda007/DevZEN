import { NextResponse, NextRequest } from "next/server";
import Response from "../../Utils/Response";
import { prisma } from '@workspace/db'
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "@/lib/Auth/auth_Config";
import { VerifyProjectSchemaWeb } from "@workspace/types";


const VerifyProject = async (req: NextRequest,) => {
    const curUser = await getServerSession(NEXT_AUTH_CONFIG);
    if (!curUser || !curUser.user || !curUser.user.email) {
        return NextResponse.redirect('/auth/signin');
    }

    const body = await req.json()
    const parsedBody = VerifyProjectSchemaWeb.safeParse(body);

    if (!parsedBody.success) {
        return NextResponse.json(new Response(403, "Not provided the project id", null), { status: 403 });
    }

    const { projectId, shareStatus ,shareStatusCode} = parsedBody.data
    console.log(shareStatus,shareStatusCode)
    if (!shareStatus || !shareStatusCode) {
        try {
            const verifyProject = await prisma.projects.findFirst({
                where: {
                    id: projectId,
                    user: {
                        email: curUser.user.email
                    }
                }
            })
            if (!verifyProject) {
                return NextResponse.json(new Response(401, "Unauthorized Access get a share url", false))
            }
            return NextResponse.json(new Response(200, "You are the authorized", true))

        } catch (error) {
            console.error(error);
            return NextResponse.json(new Response(500, "Internal Server Error", null), { status: 500 })
        }
    } else {
        console.log("share code  ran here")
        const verifyProject = await prisma.projects.findFirst({
            where: {
                id: projectId,
                share_code:shareStatusCode
            }
        })
        if (!verifyProject) {
            return NextResponse.json(new Response(401, "Unauthorized Access get a share url", false))
        }
        return NextResponse.json(new Response(200, "You are the authorized", true))

    }

}

export default VerifyProject