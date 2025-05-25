"use client";
import React from "react";
import MonacoEditor from "@workspace/ui/components/Code/MonacoEditor";
import Sidebar from "@workspace/ui/components/Code/Sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DialogBox from "@workspace/ui/components/Code/DialogBox";

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
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [typeDialog, setTypeDialog] = useState<string>("");
  const [path, setPath] = useState<string>("");
  return (
    <div className="w-full h-full flex overflow-hidden">
      {dialogOpen && <DialogBox loaderState={dialogOpen} type={typeDialog} setLoaderState={setDialogOpen} path={path}/>}
      <Sidebar
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setTypeDialog={setTypeDialog}
        setPath = {setPath}
      />

      <div className="w-5/6 h-full">
        <MonacoEditor
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
