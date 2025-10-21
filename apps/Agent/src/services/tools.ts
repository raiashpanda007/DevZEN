import { z as zod } from "zod"
import type { ChatCompletionTool } from "openai/resources";
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
const Tools = [
    {
        strict: true,
        type: "function",
        name: "Create_Project",
        description: "Creates a project in the DB for a chat session if no project exists. Should only be called after confirming that no project exists for this session.",
        parameters: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "Name of the project"
                },
                template: {
                    type: "string",
                    enum: templateEnum.options,
                    description: "The template to use for the project"
                },
                userId: {
                    type: "string",
                    description: "ID of the user creating the project"
                }
            },
            required: ["name", "template", "userId"]
        }
    }
]

export default Tools