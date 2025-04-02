"use client";
import { useRef, useEffect, useState } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import * as monaco from "monaco-editor";
import Run from "@workspace/ui/components/Code/Run";
import Console from "@workspace/ui/components/Code/Console";
const MonacoEditor = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [theme, setTheme] = useState("vs-dark");
  const currTheme = useTheme().theme;
  useEffect(() => {
    if (currTheme === "dark") {
      setTheme("vs-dark");
    } else {
      setTheme("vs-light");
    }
  });

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  return (
    <div className="relative ">
    
      <div className="w-full">
        <Editor
          height="750px"
          defaultLanguage="javascript"
          defaultValue="// Write your code here... "
          theme={theme}
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            automaticLayout: true,
          }}
          onMount={handleEditorMount}
        />
      </div>
      
        <div className="flex w-full">
        <Run />
        <Console/>

        </div>
      
    </div>
  );
};

export default MonacoEditor;
