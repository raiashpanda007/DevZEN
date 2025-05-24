"use client"
import React, { useEffect, useState } from "react";
import { useSocket } from "@workspace/ui/hooks/useSocket";
import {  Directory, RemoteFile, buildFileTree } from '@workspace/ui/components/Code/FileStructure';
import { FileTree } from "@workspace/ui/components/Code/FileTree";
import {ScrollArea} from "@workspace/ui/components/scroll-area";
import type { File as FileTypes } from "@workspace/types";
import {  RECIEVED_FILE_FETCH } from "@workspace/types";

interface SidebarProps {
  selectedFile: FileTypes | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileTypes | undefined>>;
}

function Sidebar(
  { selectedFile, setSelectedFile }: SidebarProps
) {
  const { socket } = useSocket("ws://localhost:8080");
  const [rootDir, setRootDir] = useState<Directory | null>(null);
  

  

  useEffect(() => {
    if(!socket) return;

    const handleMessage = (event: MessageEvent) => {
     
      const data = JSON.parse(event.data);
      
      if (data.type === "received_init_dir_fetch") {
        console.log("Received initial directory structure:", data.payload.dirs);
        const files: RemoteFile[] = data.payload.dirs;
        console.log("Files:", files);
        const tree = buildFileTree(files);
        setRootDir(tree);
      } 
      else if (data.type === RECIEVED_FILE_FETCH) {
        console.log("Received file content")
        setSelectedFile((prev) => {
          if (!prev) return undefined;
          return {
            ...prev,
            content: data.payload.content,
          };
        });
        
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  useEffect(()=>{
    console.log("Selected file changed", selectedFile);
    if(!socket) return;
    const fileFetchMessage = {
      type: "file_fetch",
      payload: {
        path: selectedFile ? selectedFile.path : "",
      },
    }
    socket.send(JSON.stringify(fileFetchMessage))
  },[selectedFile?.path])

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <ScrollArea className="w-1/2 sm:w-1/6 h-[calc(100vh-96px)] border p-4 text-white overflow-y-auto"> 
      {rootDir ? (
        <FileTree rootDir={rootDir} selectedFile={selectedFile} onSelect={setSelectedFile} />
      ) : (
        <div>Loading files...</div>
      )}
    </ScrollArea>
  );
}

export default Sidebar;
