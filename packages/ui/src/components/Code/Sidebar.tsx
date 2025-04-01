"use client"
import { useEffect, useState } from "react";
import { useSocket } from "@workspace/ui/hooks/useSocket.js";
import { File, Directory, RemoteFile, buildFileTree } from './FileStructure.js';
import { FileTree } from "./FileTree.js";

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
    <div className="w-1/6 h-full p-4 bg-gray-900 text-white">
      {rootDir ? (
        <FileTree rootDir={rootDir} selectedFile={selectedFile} onSelect={setSelectedFile} />
      ) : (
        <div>Loading files...</div>
      )}
    </div>
  );
}

export default Sidebar;
