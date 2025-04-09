"use client";
import { useRef, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import loader from "@monaco-editor/loader";

import Run from "@workspace/ui/components/Code/Run";
import Console from "@workspace/ui/components/Code/Console";
import type { File as FileTypes } from "@workspace/types";
import { getLanguageFromFileName } from "@workspace/ui/lib/getLanguagefromName";

interface MonacoEditorProps {
  selectedFile: FileTypes | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileTypes | undefined>>;
}

const MonacoEditor = ({ selectedFile, setSelectedFile }: MonacoEditorProps) => {
  const editorRef = useRef<any>(null);
  const [theme, setTheme] = useState("vs-dark");
  const currTheme = useTheme().theme;

  useEffect(() => {
    (loader as any).init().then((monaco: typeof import("monaco-editor")) => {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });
  
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        allowJs: true,
        checkJs: false,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        esModuleInterop: true,
      });
    });

    
  }, []);

  useEffect(() => {
    setTheme(currTheme === "dark" ? "vs-dark" : "vs-light");
  }, [currTheme]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="relative">
      <div className="w-full">
        <Editor
          height="750px"
          language={
            selectedFile
              ? getLanguageFromFileName(selectedFile.name)
              : "plaintext"
          }
          value={selectedFile?.content || "// Select a file to view/edit..."}
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
        <Console />
      </div>
    </div>
  );
};

export default MonacoEditor;
