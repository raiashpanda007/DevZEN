import { server } from "./mcp";
import { z as zod } from "zod";
import { prisma } from "@workspace/db/"
import axios from "axios"
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
    name:zod.string(),
    id:zod.string(),
    image:zod.string()
})

server.registerTool(
    'create-project',
    {
        title: "Create Project",
        description: "It creates project on user name",
        inputSchema: {
            name: zod.string().min(2, "Project name is required"),
            template:templateType,
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