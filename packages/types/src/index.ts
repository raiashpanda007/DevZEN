import type { Template } from "./Templates"
import { ProjectItem } from "./ProjectItem"
import {z as zod } from 'zod';
export const CreateProjectSchemaBackend = zod.object({
    projectId: zod.string().nonempty(),
    language: zod.string().nonempty(),
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




export const MESSAGE_INIT = "project_initialized"
export const DIR_FETCH = "dir_fetch"
export const FILE_FETCH = "file_fetch"
export const RECEIVED_DIR_FETCH = "received_dir_fetch"
export const RECEIVED_INIT_DIR_FETCH = "received_init_dir_fetch"
export const RECIEVED_FILE_FETCH = "received_file_fetch"
export const MESSAGE_CREATE_FILE = 'create_file'
export const MESSAGE_DELETE_FILE = 'delete_file'
export const MESSAGE_CREATE_FOLDER = 'create_folder'
export const MESSAGE_DELETE_FOLDER = 'delete_folder'
export const MESSAGE_RENAME_FOLDER = 'rename_folder'
export const MESSAGE_RENAME_FILE = 'rename_file'


