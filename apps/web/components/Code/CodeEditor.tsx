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
    
  const {socket, socketState} = useSocket(wsServerURL || "")
 useEffect(() => {
  // Update loading state based on socket connection state
  if (socketState.isConnected) {
    dispatch(loadinghandler(false));
  } else if (socketState.isConnecting || socketState.retryCount > 0) {
    dispatch(loadinghandler(true));
  } else if (socketState.error && socketState.retryCount === 0) {
    // Only show as not loading if there's an error and no retries planned
    dispatch(loadinghandler(false));
  }

  // Log connection state for debugging
  if (socketState.error) {
    console.log('Socket connection error:', socketState.error);
  }
}, [socketState, dispatch]);

  return (
    <div className="w-full h-[calc(100vh-96px)] flex flex-col overflow-hidden">
      {/* Connection Status Indicator */}
      {(socketState.isConnecting || socketState.error) && (
        <div className={`px-4 py-2 text-sm ${
          socketState.error && socketState.retryCount === 0 
            ? 'bg-red-100 text-red-700 border-b border-red-200' 
            : 'bg-blue-100 text-blue-700 border-b border-blue-200'
        }`}>
          {socketState.isConnecting && socketState.retryCount === 0 && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Connecting to development server...</span>
            </div>
          )}
          {socketState.error && socketState.retryCount > 0 && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>{socketState.error}</span>
            </div>
          )}
          {socketState.error && socketState.retryCount === 0 && (
            <span>{socketState.error}</span>
          )}
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
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
    </div>
  );
}

export default CodeEditor;
