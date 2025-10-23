import { server } from "./mcp";
import { z as zod } from "zod";
import { prisma } from "@workspace/db/"
import axios from "axios"
import ToolsList from "@workspace/functions"
const templateEnum = zod.enum([
    'node_js',
    'node_js_typescript',
    'react',
    'react_typescript',
    'cpp',
    'python',
    'python_django',
    'next_js',
    'next_js_turbo'
]);
const templateType = zod.object({
    name: zod.string(),
    id: zod.string(),
    image: zod.string()
})



server.registerTool(
    `${ToolsList.CREATE_PROJECT}`,
    {
        title: ToolsList.CREATE_PROJECT,
        description: "Creates a project in the DB for a chat session if no project exists. Should only be called after confirming that no project exists for this session. Try to name project more of a product type let's say user asks for spotify clone then give it new cool name unless user explicitly said for a particular name",
        inputSchema: {
            name: zod.string().min(2, "Project name is required"),
            template: templateType,
            userId: zod.string()
        },
        outputSchema: {
            project: zod.object({
                name: zod.string(),
                id: zod.string(),
                createdAt: zod.date(),
                share_code: zod.string(),
                userId: zod.string(),
                template: templateEnum
            }).nullable()
        },
    },
    async ({ name, template, userId }) => {
        try {
            const copyS3CodeFiles = async (projectId: string, language: string) => {
                try {
                    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_SERVER}/project`, {
                        projectId,
                        language
                    });
                } catch (error) {
                    console.error("Error in copying S3 code files:", error);
                    throw ("Error in copying S3 code files");
                }
            }

            const project = await prisma.projects.create({
                data: {
                    name,
                    template: template.id as any,
                    user: {
                        connect: { id: userId }
                    }
                }
            });

            await copyS3CodeFiles(project.id, template.id);

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(project),
                    },
                ]
            }

        } catch (error) {
            throw error;
        }
    }
);

const ListOFTemplates = [
    {
        name: 'Node JS',
        id: 'node_js',
        image: 'node-js.svg',
    },
    {
        name: 'React JS',
        id: 'react_js',
        image: 'react.svg',
    },
    {
        name: 'React with TypeScript',
        id: 'react_typescript',
        image: 'react.svg',
    },
    {
        name: 'Node JS with TypeScript',
        id: 'node_js_typescript',
        image: 'typescript.svg',
    },
    {
        name: 'C++',
        id: 'cpp',
        image: 'cpp.svg',
    },
    {
        name: 'Python',
        id: 'python',
        image: 'python.svg',
    },
    {
        name: 'Python with Django',
        id: 'python_django',
        image: 'django.svg',
    },
    {
        name: 'NextJS with TypeScript',
        id: 'next_js',
        image: 'next.svg',
    }, {
        name: 'Next with TurboRepo',
        id: 'next_js_turbo',
        image: 'next.svg',
    }
]
server.registerTool(
    `${ToolsList.GET_TEMPLATES}`,
    {
        title: ToolsList.GET_TEMPLATES,
        description: "This function fetch the list all the templates which devzen offers on which agent can build projects upon. Step should be taken before creating project",
        inputSchema: {},
        outputSchema: {
            templates: zod.array(
                zod.object({
                    name: zod.string(),
                    id: zod.string(),
                })
            )
        }
    },
    () => {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(ListOFTemplates)

                }
            ]
        }
    }

)

server.registerTool(
    ToolsList.CHECK_PROJECT_ASSOCIATED,
    {
        title: ToolsList.CHECK_PROJECT_ASSOCIATED,
        description: "This is the function that checks that is any project associcated to chat , if Yes it will it will connect you to pod, else No return false",
        inputSchema:{
            chatId:zod.string()
        },
        outputSchema:{
            result : zod.string() || zod.boolean()
        }
    },
    async ({chatId}) =>{
        try {
            const ProjectFromChat = await prisma.chats.findFirst({
                where:{
                    id:chatId
                }
            });
            if(!ProjectFromChat || !ProjectFromChat.projectId) {
                return {
                    content:[
                        {
                            type:"text",
                            text:JSON.stringify(false)
                        }
                    ]
                }    
            }
            return {
                content:[
                    {
                        type:"text",
                        text:JSON.stringify(ProjectFromChat.projectId)
                    }
                ]
            }
        } catch (error) {
            throw error;
        }
    }
)


