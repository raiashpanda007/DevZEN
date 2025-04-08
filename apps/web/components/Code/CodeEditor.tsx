"use client"
import React from "react";
import MonacoEditor from "@workspace/ui/components/Code/MonacoEditor";
import Sidebar from "@workspace/ui/components/Code/Sidebar";
import { useState } from "react";

export enum Type {
  FILE,
  DIRECTORY,
  DUMMY
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
  return (
    <div className="w-full h-full flex overflow-hidden">
      <Sidebar selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>

      <div className="w-5/6 h-full">
        <MonacoEditor selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>
      </div>
    </div>
  );
}

export default CodeEditor;
