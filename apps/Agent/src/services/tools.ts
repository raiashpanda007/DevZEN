import { z as zod } from "zod"
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
const Tools = [
    {
        strict: true,
        type: "function",
        name: ToolsList.CREATE_PROJECT,
        description: "Creates a project in the DB for a chat session if no project exists. Should only be called after confirming that no project exists for this session. Try to name project more of a product type let's say user asks for spotify clone then give it new cool name unless user explicitly said for a particular name",
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