// Dynamically sets MonacoEnvironment for proper web worker loading

export const setupMonacoEnvironment = () => {
    if (typeof window === "undefined") return;
  
    const version = "0.52.2";
  
    // Set global MonacoEnvironment to use CDN workers
    self.MonacoEnvironment = {
      getWorkerUrl: function (_moduleId: string, label: string) {
        const workerMain =
          label === "json"
            ? "json.worker.js"
            : label === "css" || label === "scss" || label === "less"
            ? "css.worker.js"
            : label === "html" || label === "handlebars" || label === "razor"
            ? "html.worker.js"
            : label === "typescript" || label === "javascript"
            ? "ts.worker.js"
            : "editor.worker.js";
  
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
          self.MonacoEnvironment = {
            baseUrl: 'https://unpkg.com/monaco-editor@${version}/min/'
          };
          importScripts('https://unpkg.com/monaco-editor@${version}/min/vs/base/worker/${workerMain}');
        `)}`;
      },
    };
  };
  