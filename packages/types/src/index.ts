import type { Template } from "./Templates"
import { ProjectItem } from "./ProjectItem"
import {z as zod } from 'zod';
export const CreateProjectSchemaBackend = zod.object({
    projectId: zod.string().nonempty(),
    language: zod.string().nonempty(),
})

export const VerifyProjectSchemaWeb = zod.object({
  projectId:zod.string().nonempty()
})

export type CreateProjectSchemaType = zod.infer<typeof CreateProjectSchemaBackend>;
export type { Template,ProjectItem }
export { CreateProjectSchema } from "./Schema/CreateProjectSchema"

export enum Type {
    FILE,
    DIRECTORY,
    DUMMY
  }
  
export interface CommonProps {
      id: string;
      type: Type;
      name: string;
      content?: string;
      path: string;
      parentId: string | undefined;
      depth: number;
  }
export interface File extends CommonProps{}


// Export all named exports from MESSAGE_TYPES as named exports
export {Messages} from "./Messages";


