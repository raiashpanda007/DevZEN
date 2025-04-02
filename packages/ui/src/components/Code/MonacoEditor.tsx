"use client"
import { useRef, useEffect, useState } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import * as monaco from "monaco-editor";

const MonacoEditor = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [theme, setTheme] = useState("vs-dark");
  const currTheme = useTheme().theme;
  useEffect(() =>{
   
    if (currTheme === "dark") {
      setTheme("vs-dark");
    } else {
      setTheme("vs-light");
    }
  })

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      height="790px"
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
  );
};

export default MonacoEditor;