const extensionToLanguageMap: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    py: "python",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    c: "cpp",
    json: "json",
    md: "markdown",
    html: "html",
    css: "css",
    sh: "shell",
    java: "java",
    go: "go",
    php: "php",
    rs: "rust",
    txt: "plaintext",
  };
  
 export  const getLanguageFromFileName = (fileName: string): string => {
    console.log("File name: ", fileName);
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    console.log("File extension: ", extensionToLanguageMap[ext]);
    return extensionToLanguageMap[ext] || "plaintext";
  };
  