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
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const [theme, setTheme] = useState("vs-dark");
  const currTheme = useTheme().theme;

  useEffect(() => {
    (loader as any ).init().then((monaco: typeof import("monaco-editor")) => {
      monacoRef.current = monaco;
    });
  }, []);

  useEffect(() => {
    setTheme(currTheme === "dark" ? "vs-dark" : "vs-light");
  }, [currTheme]);

  const handleEditorMount = (editor: any, monaco: typeof import("monaco-editor")) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  useEffect(() => {
    if (!selectedFile || !monacoRef.current) return;

    const monaco = monacoRef.current;
    const language = getLanguageFromFileName(selectedFile.name);
    const modelUri = monaco.Uri.parse(`inmemory://model/${selectedFile.name}`);
    let model = monaco.editor.getModel(modelUri);

    if (!model) {
      model = monaco.editor.createModel(
        selectedFile.content || "",
        language,
        modelUri
      );
    } else {
      model.setValue(selectedFile.content || "");
    }

    if (editorRef.current) {
      editorRef.current.setModel(model);
    }

    
    if (language === "typescript" || language === "javascript") {
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
    }
  }, [selectedFile]);

  return (
    <div className="relative">
      <Editor
        height="750px"
        theme={theme}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          automaticLayout: true,
        }}
      />
      <div className="flex w-full">
        <Run />
        <Console />
      </div>
    </div>
  );
};

export default MonacoEditor;
