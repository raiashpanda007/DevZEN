"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
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
import type * as monaco from "monaco-editor";

interface MonacoEditorProps {
  selectedFile: FileTypes | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileTypes | undefined>>;
  socket: WebSocket | null;
}

interface SharedDialogBoxProps {
  URL: string | null;
  setSharedDialogBox: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareDialogBox = ({ URL, setSharedDialogBox }: SharedDialogBoxProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = useCallback(() => {
    if (URL) {
      navigator.clipboard.writeText(URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [URL]);

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
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const [content, setContent] = useState<string>("");
  const [theme, setTheme] = useState<string>("vs-light");
  const [sharedDialogBox, setSharedDialogBox] = useState(false);
  const [shareURL, setShareURL] = useState<string | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const { theme: currTheme } = useTheme();

  // Memoize the file path to prevent unnecessary re-renders
  const currentFilePath = useMemo(() => selectedFile?.path, [selectedFile?.path]);
  const currentFileContent = useMemo(() => selectedFile?.content || "", [selectedFile?.content]);

  const updateContent = useCallback((
    socket: WebSocket | null,
    content: string,
    path: string
  ) => {
    if (!content || !socket || socket.readyState !== WebSocket.OPEN) return;
    
    try {
      socket.send(
        JSON.stringify({
          type: "save_file_content",
          payload: {
            path,
            content,
          },
        })
      );
    } catch (error) {
      console.error("Failed to send content update:", error);
    }
  }, []);

  // Debounce content changes
  const [debouncedContent, setDebouncedContent] = useState<string>("");
  
  useDebounce(() => {
    if (content && content !== currentFileContent && currentFilePath) {
      setDebouncedContent(content);
    }
  }, 750, [content, currentFileContent, currentFilePath]);

  // Set theme based on current theme
  useEffect(() => {
    const newTheme = currTheme === "dark" ? "vs-dark" : "vs-light";
    if (newTheme !== theme) {
      setTheme(newTheme);
    }
  }, [currTheme, theme]);

  // Update content when debounced content changes
  useEffect(() => {
    if (debouncedContent && currentFilePath) {
      updateContent(socket, debouncedContent, currentFilePath);
    }
  }, [debouncedContent, currentFilePath, socket, updateContent]);

  // Handle editor mount
  const handleEditorMount = useCallback((
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor")
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsEditorReady(true);
  }, []);

  // Setup model and language support when selectedFile changes
  useEffect(() => {
    if (!selectedFile || !monacoRef.current || !editorRef.current || !isEditorReady) return;

    const monaco = monacoRef.current;
    const editor = editorRef.current;
    const language = getLanguageFromFileName(selectedFile.name);
    const modelUri = monaco.Uri.parse(`inmemory://model/${selectedFile.path}`);
    
    try {
      // Check if model already exists
      let model = monaco.editor.getModel(modelUri);

      if (!model) {
        // Create new model
        model = monaco.editor.createModel(
          currentFileContent,
          language,
          modelUri
        );
      } else {
        model.setValue(currentFileContent);
      }

      // Set the model to the editor
      if (editor.getModel() !== model) {
        editor.setModel(model);
      }

      // Set content state
      setContent(currentFileContent);

      // Configure TypeScript/JavaScript language support
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
    } catch (error) {
      console.error("Failed to setup Monaco model:", error);
    }
  }, [selectedFile, isEditorReady, currentFileContent]);

  // Setup change listener
  useEffect(() => {
    if (!editorRef.current || !isEditorReady) return;

    const editor = editorRef.current;
    const disposable = editor.onDidChangeModelContent((e) => {
      const currentValue = editor.getValue();
      console.log("Changes log",e.changes)
      if (currentValue !== content) {

        setContent(currentValue);
      }
    });

    return () => {
      disposable.dispose();
    };
  }, [isEditorReady, content]);

  // Early return if no file selected
  if (!selectedFile || selectedFile.type !== Type.FILE) {
    return null;
  }

  if (sharedDialogBox) {
    return <ShareDialogBox URL={shareURL} setSharedDialogBox={setSharedDialogBox} />;
  }

  return (
    <div className="relative">
      <Editor
        className="relative"
        height="750px"
        theme={theme}
        value={content}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          automaticLayout: true,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: "line",
        }}
        loading={<div className="flex items-center justify-center h-full">Loading editor...</div>}
      />
      <div className="flex w-full">
        <Run />
        <Console />
        <ShareProjectButton setSharedDialogBox={setSharedDialogBox} setShareURL={setShareURL} />
      </div>
    </div>
  );
};

export default MonacoEditor;