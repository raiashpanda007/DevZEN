import type { Template } from "./Templates"
import { ProjectItem } from "./ProjectItem"
import {z as zod } from 'zod';
export const CreateProjectSchemaBackend = zod.object({
    projectId: zod.string().nonempty(),
    language: zod.string().nonempty(),
})
export type CreateProjectSchemaType = zod.infer<typeof CreateProjectSchemaBackend>;
export type { Template,ProjectItem }
export { CreateProjectSchema } from "./CreateProjectSchema"

export const MESSAGE_INIT = "project_initialized"
export const DIR_FETCH = "dir_fetch"




