"use client"
import { useEffect, useState } from "react";
import { useSocket } from "@workspace/ui/hooks/useSocket";
import { File, Directory, RemoteFile, buildFileTree } from '@workspace/ui/components/Code/FileStructure';
import { FileTree } from "@workspace/ui/components/Code/FileTree";
import {ScrollArea} from "@workspace/ui/components/scroll-area";

function Sidebar() {
  const { socket } = useSocket("ws://localhost:8080");
  const [rootDir, setRootDir] = useState<Directory | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
     
      const data = JSON.parse(event.data);
      
      if (data.type === "received_init_dir_fetch") {
        console.log("Received initial directory structure:", data.payload.dirs);
        const files: RemoteFile[] = data.payload.dirs;
        console.log("Files:", files);
        const tree = buildFileTree(files);
        setRootDir(tree);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

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
