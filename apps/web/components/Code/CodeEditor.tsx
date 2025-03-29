import React from "react";
import MonacoEditor from "@workspace/ui/components/Code/MonacoEditor";
import Sidebar from "@workspace/ui/components/Code/Sidebar";

function CodeEditor() {
  return (
    <div className="w-full flex h-full">
      <Sidebar />

      <div className="w-5/6 h-full">
        <MonacoEditor />
      </div>
    </div>
  );
}

export default CodeEditor;
