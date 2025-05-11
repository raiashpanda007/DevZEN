import Response from "../../Utils/Response";
import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@workspace/db";
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "../../Auth/auth_Config";


const GetProjects = async (req:NextRequest) => {
    const currUser = await getServerSession(NEXT_AUTH_CONFIG);
    if(!currUser || !currUser.user){
        console.log("User not found");
        console.log(req.url);
        return NextResponse.json(new Response(401, "Unauthorized", {}),{status:401});
    }
    const user = currUser.user as {id:string,email:string,username:string,profile:string,Account:string};
    try {
        const projects = await prisma.projects.findMany({
            where:{
                userId:user.id
            }
        });
        return NextResponse.json(new Response(200, "Successfully user projects", projects),{status:200});

    } catch (error) {
        console.log(error);
        return NextResponse .json(new Response(500, "Internal Server Error", {error}),{status:500});

    }

}
export default GetProjects