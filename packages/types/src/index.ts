import type { Template } from "./Templates"
import { ProjectItem } from "./ProjectItem"
import {z as zod } from 'zod';
export const CreateProjectSchemaBackend = zod.object({
    projectId: zod.string().nonempty(),
    language: zod.string().nonempty(),
})

export const VerifyProjectSchemaWeb = zod.object({
  projectId:zod.string().nonempty(),
  shareStatus:zod.boolean().optional(),
  shareStatusCode:zod.string().optional()
})



export const GenerateShareURLSchemaWeb = zod.object({
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
export type CharObj = {
  id:string
  value:string
}



export interface InsertTypeOps {
    type: "insert";
    id: string;
    value: string ;
    after: string | null;
    timeStamp: Date;
}

export interface DeleteTypeOps {
    type: "delete";
    id: string;
    timeStamp: Date

}

export type Ops = InsertTypeOps | DeleteTypeOps


export {Messages} from "./Messages";


