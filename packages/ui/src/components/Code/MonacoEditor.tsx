"use client";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useDebounce } from "react-use";

import Console from "@workspace/ui/components/Code/Console";
import type { File as FileTypes } from "@workspace/types";
import { Type } from "@workspace/types";
import { getLanguageFromFileName } from "@workspace/ui/lib/getLanguagefromName";
import ShareProjectButton from "@workspace/ui/components/Code/ShareProject";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { FiCopy } from "react-icons/fi";
import type * as monaco from "monaco-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { TerminalComponent } from "@workspace/ui/components/Code/Terminal";

interface MonacoEditorProps {
  selectedFile: FileTypes | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileTypes | undefined>>;
  socket: WebSocket | null;
  projectId: string;
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
      <div className="dark:bg-black bg-white rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto p-6 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Share Project
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Share this link with other developers to collaborate in real-time on
            your project
          </p>
          <p className="text-red-600 dark:text-red-400 text-base font-semibold leading-relaxed mt-4">
            **Warning: Share this URL only with trusted people or developers.
            Anyone with the link can access and modify your project.
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
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-all duration-200`}
              disabled={!URL}
            >
              {copied ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <FiCopy className="w-4 h-4" />
              )}
            </Button>
          </div>
          {copied && (
            <p className="text-green-600 dark:text-green-400 text-xs mt-1 flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
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
            {copied ? "Copied!" : "Copy Link"}
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
  projectId,
}: MonacoEditorProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const [content, setContent] = useState<string>("");
  const [theme, setTheme] = useState<string>("vs-light");
  const [sharedDialogBox, setSharedDialogBox] = useState(false);
  const [visibleStatusConsole, setVisibleStatusConsole] = useState(false);
  const [shareURL, setShareURL] = useState<string | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const { theme: currTheme } = useTheme();

  // Convert IdId to string for terminal component


  const currentFilePath = useMemo(
    () => selectedFile?.path,
    [selectedFile?.path]
  );
  const currentFileContent = useMemo(
    () => selectedFile?.content || "",
    [selectedFile?.content]
  );

  // Use debounced content for WebSocket updates
  useDebounce(
    () => {
      if (
        content &&
        content !== currentFileContent &&
        currentFilePath &&
        socket &&
        socket.readyState === WebSocket.OPEN
      ) {
        // Send debounced content updates to WebSocket
        socket.send(
          JSON.stringify({
            type: "file_update",
            payload: {
              content: content,
              filePath: currentFilePath,
            },
          })
        );
      }
    },
    500, // 500ms debounce delay
    [content, currentFileContent, currentFilePath, socket]
  );

  // Set theme based on current theme
  useEffect(() => {
    const newTheme = currTheme === "dark" ? "vs-dark" : "vs-light";
    if (newTheme !== theme) {
      setTheme(newTheme);
    }
  }, [currTheme, theme]);

  // Handle editor mount
  const handleEditorMount = useCallback(
    (
      editor: monaco.editor.IStandaloneCodeEditor,
      monaco: typeof import("monaco-editor")
    ) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      setIsEditorReady(true);
    },
    []
  );

  // Setup model and language support when selectedFile changes
  useEffect(() => {
    if (
      !selectedFile ||
      !monacoRef.current ||
      !editorRef.current ||
      !isEditorReady
    )
      return;

    const monaco = monacoRef.current;
    const editor = editorRef.current;
    const language = getLanguageFromFileName(selectedFile.name);
    const modelUri = monaco.Uri.parse(`inmemory://model${selectedFile.path}`);

    try {
      // Check if model already exists
      let model =
        monaco.editor.getModel(modelUri) ||
        monaco.editor.createModel(currentFileContent, language, modelUri);
      editor.setModel(model);
      model.setValue(currentFileContent);

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
          moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          target: monaco.languages.typescript.ScriptTarget.ESNext,
          module: monaco.languages.typescript.ModuleKind.ESNext,
          esModuleInterop: true,
        });
      }
    } catch (error) {
      console.error("Failed to setup Monaco model:", error);
    }
  }, [selectedFile, isEditorReady, currentFileContent]);

  // Listen for editor content changes
  useEffect(() => {
    if (!editorRef.current || !isEditorReady) return;

    const editor = editorRef.current;

    const disposable = editor.onDidChangeModelContent(() => {
      const currentContent = editor.getValue();
      setContent(currentContent);
      // WebSocket sending is now handled by the debounced effect
    });

    return () => {
      disposable.dispose();
    };
  }, [isEditorReady, selectedFile?.path]);

  // Trigger layout update when console visibility changes
  useEffect(() => {
    if (editorRef.current && isEditorReady) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        editorRef.current?.layout();
        // Force a model refresh to restore syntax highlighting
        const model = editorRef.current?.getModel();
        if (model && monacoRef.current) {
          const language = getLanguageFromFileName(selectedFile?.name || '');
          monacoRef.current.editor.setModelLanguage(model, language);
        }
      }, 150); // Increased delay slightly
    }
  }, [visibleStatusConsole, isEditorReady, selectedFile?.name]);

  const sendImmediateUpdate = useCallback(() => {
    if (
      content &&
      selectedFile &&
      socket &&
      socket.readyState === WebSocket.OPEN
    ) {
      socket.send(
        JSON.stringify({
          type: "file_update",
          payload: {
            content: content,
            filePath: selectedFile.path,
          },
        })
      );
    }
  }, [content, selectedFile, socket]);

  if (!selectedFile || selectedFile.type !== Type.FILE) {
    return null;
  }

  if (sharedDialogBox) {
    return (
      <ShareDialogBox URL={shareURL} setSharedDialogBox={setSharedDialogBox} />
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Button Bar - Fixed at top */}
      <div className="flex w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 z-10 flex-shrink-0">
        <Console setVisibleStatus={setVisibleStatusConsole} />
        <ShareProjectButton
          setSharedDialogBox={setSharedDialogBox}
          setShareURL={setShareURL}
        />
      </div>

      {/* Main Content Area - Takes remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {visibleStatusConsole ? (
          <ResizablePanelGroup
            direction="vertical"
            className="h-full w-full"
          >
            {/* Editor Panel */}
            <ResizablePanel defaultSize={70} minSize={30}>
              <div className="h-full w-full overflow-hidden">
                <Editor
                  className="relative"
                  height="100%"
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
                    smoothScrolling: true,
                    scrollbar: {
                      vertical: "auto",
                      horizontal: "auto",
                      useShadows: false,
                      verticalHasArrows: false,
                      horizontalHasArrows: false,
                      verticalScrollbarSize: 10,
                      horizontalScrollbarSize: 10,
                    },
                  }}
                  loading={
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Loading editor...
                        </span>
                      </div>
                    </div>
                  }
                />
              </div>
            </ResizablePanel>

            {/* Resizable Handle */}
            <ResizableHandle withHandle />

            {/* Terminal Panel - Replace Console Panel */}
            <ResizablePanel defaultSize={30} minSize={15} maxSize={60}>
              <TerminalComponent
                socket={socket}
                projectId={projectId}
                visible={visibleStatusConsole}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          /* Editor Only View */
          <div className="h-full w-full overflow-hidden">
            <Editor
              className="relative"
              height="100%"
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
                smoothScrolling: true,
                scrollbar: {
                  vertical: "auto",
                  horizontal: "auto",
                  useShadows: false,
                  verticalHasArrows: false,
                  horizontalHasArrows: false,
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
              }}
              loading={
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Loading editor...
                    </span>
                  </div>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MonacoEditor;
