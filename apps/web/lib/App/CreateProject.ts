import { NextResponse,NextRequest } from "next/server";
import Response from "../Utils/Response";
import {prisma} from '@workspace/db'
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "../Auth/auth_Config";
import { CreateProjectSchema} from '@workspace/types'
import { Templates } from "@prisma/client";

const CreateProject = async (req:NextRequest) =>{
    console.log("Create Project")
    const curUser = await getServerSession(NEXT_AUTH_CONFIG) 

    if( !curUser || !curUser.user){
        return NextResponse.redirect('/auth/signin')
         
    }
    const user = curUser.user as {id:string,email:string,username:string,profile:string,Account:string}
    const body = await req.json()
    const parsedBody = CreateProjectSchema.safeParse(body);
    if(!parsedBody.success){
        return NextResponse.json(new Response(400, "Invalid data", parsedBody.error),{status:400})
    }
    const {name,template} =parsedBody.data 
    
    try {
        const project = await prisma.projects.create({
            data:{
                name,
                template:template.id as Templates,
                user:{
                    connect:{
                        id:user.id
                    }
                }
            }
        })
        return NextResponse.json(new Response(200, "Project Created", project),
        {status:200})
        
    } catch (error) {
        return NextResponse.json(new Response(500, "Internal Server Error", {error}),{status:500})
        
    }

    

}

export default CreateProject