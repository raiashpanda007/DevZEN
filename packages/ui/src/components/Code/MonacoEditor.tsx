"use client";
import { useRef, useEffect, useState } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import * as monaco from "monaco-editor";
import Run from "@workspace/ui/components/Code/Run";
import Console from "@workspace/ui/components/Code/Console";
import type { File as FileTypes } from "@workspace/types";

interface MonacoEditorProps {
  selectedFile: FileTypes | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileTypes | undefined>>;
}

const MonacoEditor = ({ selectedFile, setSelectedFile }: MonacoEditorProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [theme, setTheme] = useState("vs-dark");
  const currTheme = useTheme().theme;

  useEffect(() => {
    if (currTheme === "dark") {
      setTheme("vs-dark");
    } else {
      setTheme("vs-light");
    }
  }, [currTheme]); // ← Added dependency

  useEffect(() => {
    console.log("Selected file changed", selectedFile);
  }, [selectedFile]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  return (
    <div className="relative">
      <div className="w-full">
        <Editor
          key={selectedFile?.id} // ← To reload on file switch
          height="750px"
          language="javascript" 
          value={selectedFile?.content || "// No content"}
          theme={theme}
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            automaticLayout: true,
          }}
          onMount={handleEditorMount}
          // onChange={(newValue) => {
          //   setSelectedFile((prev) =>
          //     prev ? { ...prev, content: newValue || "" } : prev
          //   );
          // }}
        />
      </div>

      <div className="flex w-full">
        <Run />
        <Console />
      </div>
    </div>
  );
};

export default MonacoEditor;
