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
import { useParams } from "next/navigation";
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
  const params  = useParams();
  const {project } = params;

   useEffect(() => {
      if(!project || !project[0]) return
    }, [project]);
    if(!process.env.NEXT_PUBLIC_SOCKET_URL) {
      return ;
    }
    const socketurl = process.env.NEXT_PUBLIC_SOCKET_URL.split("//");
    const wsServerURL = socketurl[0]+"//"+project+'.'+socketurl[1];

    console.log("socket url ; " , wsServerURL)
    
  const {socket} = useSocket(wsServerURL || "")
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
    <div className="w-full h-[calc(100vh-96px)] flex overflow-hidden">
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

      <div className="flex-1 h-full overflow-hidden">
        <Suspense fallback={<div>Loading editor...</div>}>
          <MonacoEditor
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            socket={socket}
            projectId={Array.isArray(project) ? project[0] ?? "" : project ?? ""}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default CodeEditor;
