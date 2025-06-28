"use client";

import { useRef, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import loader from "@monaco-editor/loader";
import { useDebounce } from "react-use";
import Run from "@workspace/ui/components/Code/Run";
import Console from "@workspace/ui/components/Code/Console";
import type { File as FileTypes } from "@workspace/types";
import { Type } from "@workspace/types";
import { getLanguageFromFileName } from "@workspace/ui/lib/getLanguagefromName";
import ShareProjectButton from "@workspace/ui/components/Code/ShareProject";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { FiCopy } from "react-icons/fi";


interface MonacoEditorProps {
  selectedFile: FileTypes | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileTypes | undefined>>;
  socket: WebSocket | null;
}
interface SharedDialogBoxProps {
  URL:string | null
  setSharedDialogBox:React.Dispatch<React.SetStateAction<boolean>>
}
const ShareDialogBox = ({URL,setSharedDialogBox}:SharedDialogBoxProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    if (URL) {
      navigator.clipboard.writeText(URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className=" dark:bg-black bg-white rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto p-6 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Share Project
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Share this link with other developers to collaborate in real-time on your project
          </p>
            <p className="text-red-600 dark:text-red-400 text-base font-semibold leading-relaxed mt-4">
            **Warning: Share this URL only with trusted people or developers. Anyone with the link can access and modify your project.
            </p>
        </div>

        {/* Share Link Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Share Link
          </label>
          <div className="flex gap-2">
            <Input 
              value={URL || ""}
              readOnly
              className="flex-1 font-mono text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              placeholder="Generating share link..."
            />
            <Button
              onClick={handleCopy}
              className={`px-4 py-2 ${
                copied 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-all duration-200`}
              disabled={!URL}
            >
              {copied ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <FiCopy className="w-4 h-4" />
              )}
            </Button>
          </div>
          {copied && (
            <p className="text-green-600 dark:text-green-400 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Link copied to clipboard!
            </p>
          )}
        </div>

        {/* Features */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            What collaborators can do:
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              Edit code in real-time
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              Run and test the project
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              View live changes
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setSharedDialogBox(false)}
          >
            Close
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleCopy}
            disabled={!URL}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const MonacoEditor = ({
  selectedFile,
  setSelectedFile,
  socket,
}: MonacoEditorProps) => {
  if (!selectedFile || selectedFile.type != Type.FILE) return;
  const editorRef = useRef<any>(null);
  const [debouncedContent, setDebouncedContent] = useState<string | undefined>(
    ""
  );
  const [content, setContent] = useState(selectedFile?.content);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const [theme, setTheme] = useState("github-dark-default");
  const [sharedDialogBox, setSharedDialogBox] = useState(false);
  const [shareURl,setShareURL ] = useState<string|null>(null)
  const currTheme = useTheme().theme;

  const updateContent = (
    socket: WebSocket | null,
    content: string | undefined,
    path: string
  ) => {
    if (!content) return;
    if (!socket) {
      return <>Unable to connect to backend</>;
    }
    socket.send(
      JSON.stringify({
        type: "save_file_content",
        payload: {
          path,
          content,
        },
      })
    );
  };

  useDebounce(() => setDebouncedContent(content), 750, [content]);

  useEffect(() => {
    (loader as any).init().then((monaco: typeof import("monaco-editor")) => {
      monacoRef.current = monaco;
    });
  }, []);

  useEffect(() => {
    setTheme(currTheme === "dark" ? "vs-dark" : "vs-light");
  }, [currTheme]);

  useEffect(() => {
    updateContent(socket, debouncedContent, selectedFile.path);
  }, [debouncedContent]);

  const handleEditorMount = (
    editor: any,
    monaco: typeof import("monaco-editor")
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  useEffect(() => {
    if (!selectedFile || !monacoRef.current || !socket) return;

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
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        esModuleInterop: true,
      });
    }
  }, [selectedFile]);

  return sharedDialogBox ? (
    <ShareDialogBox URL={shareURl} setSharedDialogBox={setSharedDialogBox}/>
  ) : (
    <div className="relative">
      <Editor
        className="relative"
        height="750px"
        theme={theme}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          automaticLayout: true,
        }}
        onChange={(value) => setContent(value)}
      />
      <div className="flex w-full">
        <Run />
        <Console />
        <ShareProjectButton setSharedDialogBox={setSharedDialogBox} setShareURL={setShareURL}/>
      </div>
    </div>
  );
};

export default MonacoEditor;
