"use client";
import React, { use, useEffect, useState } from "react";
import {
  Directory,
  RemoteFile,
  buildFileTree,
} from "@workspace/ui/components/Code/FileStructure";
import { FileTree } from "@workspace/ui/components/Code/FileTree";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import  { File as FileTypes } from "@workspace/types";
import { Messages } from "@workspace/types";

interface SidebarProps {
  selectedFile: FileTypes | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileTypes | undefined>>;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTypeDialog: React.Dispatch<React.SetStateAction<string>>;
  setPath: React.Dispatch<React.SetStateAction<FileTypes | undefined>>;
  socket: WebSocket | null;
}

function Sidebar({
  selectedFile,
  setSelectedFile,
  dialogOpen,
  setDialogOpen,
  setTypeDialog,
  setPath,
  socket,
}: SidebarProps) {
  const [rootDir, setRootDir] = useState<Directory | null>(null);
  const RECIEVED_FILE_FETCH = Messages.RECIEVED_FILE_FETCH;
  useEffect(() => {
    if (!socket) return;
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "received_init_dir_fetch" || data.type === "success_crud") {
        console.log("Received initial directory structure:", data.payload.dirs);
        const files: RemoteFile[] = data.payload.dirs;
        console.log("Files:", files);
        const tree = buildFileTree(files);
        setRootDir(tree);
      } else if (data.type === RECIEVED_FILE_FETCH) {
        console.log("Received file content",data);
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

  useEffect(() => {
    console.log("Selected file changed", selectedFile);
    if (!socket) return;
    const fileFetchMessage = {
      type: "file_fetch",
      payload: {
        path: selectedFile ? selectedFile.path : "",
      },
    };

    socket.send(JSON.stringify(fileFetchMessage));
  }, [selectedFile?.path]);

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <ScrollArea className="w-1/2 sm:w-1/6 h-[calc(100vh-96px)] border p-4 text-white overflow-y-auto">
      {rootDir ? (
        <FileTree
          rootDir={rootDir}
          selectedFile={selectedFile}
          onSelect={setSelectedFile}
          socket={socket}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          setTypeDialog={setTypeDialog}
          setPath={setPath}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-transparent dark:border-t-transparent border-black dark:border-white rounded-full animate-spin "></div>
        </div>
      )}
    </ScrollArea>
  );
}

export default Sidebar;
