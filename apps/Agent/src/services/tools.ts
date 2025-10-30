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
        name: ToolsList.GET_TEMPLATES,
        description: "This function fetch the list all the templates which devzen offers on which agent can build projects upon. Step should be taken before creating project.",
        parameters: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    },
    {
        strict: true,
        type: "function",
        name: ToolsList.CHECK_PROJECT_ASSOCIATED,
        description: "This is the function that checks that is any project associcated to chat , if Yes it will it will connect you to pod, else No return false",
        parameters: {
            type: "object",
            properties: {
                chatId: {
                    type: "string",
                    description: "Please provide the chatId, whose project you want to check for the chat session"
                }
            },
            required: ["chatId"]
        }
    },
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