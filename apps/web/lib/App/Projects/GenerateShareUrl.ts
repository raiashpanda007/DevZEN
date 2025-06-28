import { NextResponse,NextRequest } from "next/server";
import Response from "../../Utils/Response";
import {prisma} from '@workspace/db'
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "@/lib/Auth/auth_Config";
import {GenerateShareURLSchemaWeb} from "@workspace/types"

const GenerateShareURL = async (req: NextRequest) =>{
    const curUser = await getServerSession(NEXT_AUTH_CONFIG);
    if(!curUser || !curUser.user || !curUser.user.email){
        return NextResponse.redirect('/auth/signin');
    }
    const body = await req.json();
    const parsedBody =GenerateShareURLSchemaWeb.safeParse(body);

    if(!parsedBody.success) {
        return NextResponse.json(new Response(403,"Not provided the project id", null),{status:403});
    }
    const {projectId} = parsedBody.data;

    try {
        const projectToken = await prisma.projects.findFirst({
            where:{
                id:projectId
            }
        })
        if(!projectToken){
            return NextResponse.json(new Response(403," Invalid project id",null))
        }

        const url = `${process.env.NEXT_PUBLIC_AUTH_URL}/projects/${projectId}?share=true&shareid=${projectToken.share_code}`
       
        return NextResponse.json(new Response(200,"Share URL", url));
    } catch (error) {
        console.error(error);
        return NextResponse.json(new Response(500,"Internal Server Error",null),{status:500})
    }
}


export default GenerateShareURL