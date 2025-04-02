"use client"
import  { useRef } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

const MonacoEditor = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

  };

  return (
    <Editor
      height="790px"
      defaultLanguage="javascript"
      defaultValue="// Write your code here... "
      theme="vs-dark"
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
