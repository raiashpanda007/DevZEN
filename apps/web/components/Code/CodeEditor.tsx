"use client";
import React, { Suspense } from "react";
import dynamic from 'next/dynamic';
const MonacoEditor = dynamic(() => import('@workspace/ui/components/Code/MonacoEditor'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});
import Sidebar from "@workspace/ui/components/Code/Sidebar";
import { useState,useEffect } from "react";
import { useSocket } from "@workspace/ui/hooks/useSocket";
import DialogBox from "@workspace/ui/components/Code/DialogBox";
import {useDispatch} from "react-redux";
import { loadinghandler } from "@/store/Loader";



export enum Type {
  FILE,
  DIRECTORY,
  DUMMY,
}

interface CommonProps {
  id: string;
  type: Type;
  name: string;
  content?: string;
  path: string;
  parentId: string | undefined;
  depth: number;
}

export interface File extends CommonProps {}
function CodeEditor() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [typeDialog, setTypeDialog] = useState<string>("");
  const [path, setPath] = useState<File | undefined>();
  const dispatch = useDispatch();


  const {socket} = useSocket(process.env.NEXT_PUBLIC_SOCKET_URL || "")
 useEffect(() => {
  if (!socket) return;

  const checkSocket = () => {
    if (socket.readyState === WebSocket.OPEN) {
      dispatch(loadinghandler(false));
    } else {
      dispatch(loadinghandler(true));
    }
  };

  checkSocket();

  socket.addEventListener("open", checkSocket);
  socket.addEventListener("close", checkSocket);

  return () => {
    socket.removeEventListener("open", checkSocket);
    socket.removeEventListener("close", checkSocket);
  };
}, [socket]);

  return (
    <div className="w-full h-full flex overflow-hidden">
      {dialogOpen && (
        <DialogBox
          loaderState={dialogOpen}
          type={typeDialog}
          setLoaderState={setDialogOpen}
          path={path}
          socket={socket}
        />
      )}
      <Sidebar
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setTypeDialog={setTypeDialog}
        setPath={setPath}
        socket={socket}
      />

      <div className="w-4/5 ">
        <Suspense  fallback={<div>Loading editor...</div>}>
        <MonacoEditor
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          socket = {socket}
        />
      </Suspense>
      </div>
    </div>
  );
}

export default CodeEditor;
