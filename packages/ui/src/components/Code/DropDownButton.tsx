// TODO: Please make sure to remove Socket from the props if not needed

"use client";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { FiMoreHorizontal } from "react-icons/fi";
import type {
  Directory,
  File,
 
} from "@workspace/ui/components/Code/FileStructure";
import { Type } from "@workspace/ui/components/Code/FileStructure";


function File_DirMoreOptions({
  directory,
  socket,
  dialogOpen,
  setDialogOpen,
  setDialogType,
  setPath,
}: {
  directory: File | undefined;
  socket: WebSocket | null;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogType: React.Dispatch<React.SetStateAction<string>>;
  setPath: React.Dispatch<React.SetStateAction<File| undefined>>;
}) {
  const handleClick = (type: string , directory:File|undefined) => {
    console.log("Clicked:", type, "on directory:", directory);
    setDialogOpen((prev) => !prev);
    setDialogType(type);
    if (directory) {
      setPath(directory);
    } else {
      setPath(undefined);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-5 shrink-0">
          <FiMoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {
             directory?.type === Type.DIRECTORY ? (<DropdownMenuItem onClick={() => handleClick("Create Directory",directory)}>
            New Folder
            <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>) : null
          }
          {
            directory?.type === Type.DIRECTORY ? (<DropdownMenuItem onClick={() => handleClick("Create File",directory)}>
            New File
            <DropdownMenuShortcut>⇧⌘F</DropdownMenuShortcut>
          </DropdownMenuItem>) : null
          }
          <DropdownMenuItem onClick={() => handleClick("Rename",directory)}>
            Rename
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => handleClick("Delete",directory)}
          >
            Delete
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default File_DirMoreOptions;
