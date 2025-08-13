import { useEffect, useRef, useState, useCallback } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { SearchAddon } from "@xterm/addon-search";
import "@xterm/xterm/css/xterm.css";
import {Messages} from "@workspace/types"

interface TerminalComponentProps {
  socket: WebSocket | null;
  projectId: string;
  visible?: boolean;
}

const {MESSAGE_REQUEST_TERMINAL, MESSAGE_UPDATE_TERMINAL} = Messages;

const OPTIONS_TERM = {
  cursorBlink: true,
  fontSize: 14,
  fontFamily: 'Fira Mono, Menlo, Monaco, "Ubuntu Mono", monospace',
  lineHeight: 1.2,
  theme: {
    background: "#1e1e1e",
    foreground: "#d4d4d4",
    cursor: "#ffffff",
    black: "#000000",
    red: "#cd3131",
    green: "#0dbc79",
    yellow: "#e5e510",
    blue: "#2472c8",
    magenta: "#bc3fbc",
    cyan: "#11a8cd",
    white: "#e5e5e5",
    brightBlack: "#666666",
    brightRed: "#f14c4c",
    brightGreen: "#23d18b",
    brightYellow: "#f5f543",
    brightBlue: "#3b8eea",
    brightMagenta: "#d670d6",
    brightCyan: "#29b8db",
    brightWhite: "#e5e5e5",
  },
  scrollback: 1000,
  convertEol: true,
};

export const TerminalComponent = ({ socket, projectId, visible = true }: TerminalComponentProps) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [isTerminalReady, setIsTerminalReady] = useState(false);

  const sendResize = useCallback(() => {
    const term = terminalInstanceRef.current;
    if (!term || !socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({
      type: MESSAGE_UPDATE_TERMINAL,
      payload: { resize: { cols: term.cols, rows: term.rows } }
    }));
  }, [socket]);

  const fitAndResize = useCallback(() => {
    const fitAddon = fitAddonRef.current;
    if (!fitAddon) return;
    fitAddon.fit();
    sendResize();
  }, [sendResize]);

  useEffect(() => {
    if (!terminalRef.current || !visible) return;
    const term = new Terminal(OPTIONS_TERM);
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const searchAddon = new SearchAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.loadAddon(searchAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    terminalInstanceRef.current = term;
    fitAddonRef.current = fitAddon;
    // initial resize -> backend pty
    sendResize();
    term.writeln('\x1b[32m╭─────────────────────────────────────╮\x1b[0m');
    term.writeln('\x1b[32m│          DevZen Terminal           │\x1b[0m');
    term.writeln('\x1b[32m╰─────────────────────────────────────╯\x1b[0m');
    term.writeln('');
    term.writeln('\x1b[36mConnecting to terminal...\x1b[0m');
    setIsTerminalReady(true);

    const dataDisp = term.onData((data: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: MESSAGE_UPDATE_TERMINAL,
            payload: { data }
        }));
      }
    });

    // Observe container size changes (splits, sidebar toggle, etc.)
    const ro = new ResizeObserver(() => {
      // rAF avoids layout thrash
      requestAnimationFrame(fitAndResize);
    });
    ro.observe(terminalRef.current);
    resizeObserverRef.current = ro;

    return () => {
      dataDisp.dispose();
      ro.disconnect();
      term.dispose();
      terminalInstanceRef.current = null;
      fitAddonRef.current = null;
      setIsTerminalReady(false);
    };
  }, [visible, socket, projectId, fitAndResize, sendResize]);

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket || !isTerminalReady || !terminalInstanceRef.current) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'terminal:data' && terminalInstanceRef.current) {
          const data = message.data;
          if (typeof data === 'string') {
            terminalInstanceRef.current.write(data);
          } else if (data instanceof ArrayBuffer) {
            const str = new TextDecoder("utf-8").decode(data);
            terminalInstanceRef.current.write(str);
          }
        }
      } catch (error) {
        console.error('Error parsing terminal message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, isTerminalReady]);

  // Request terminal when component mounts and socket is ready
  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN && projectId && isTerminalReady) {
      socket.send(JSON.stringify({
        type: MESSAGE_REQUEST_TERMINAL,
        payload: { projectId }
      }));
    }
  }, [socket, projectId, isTerminalReady]);

  // Refocus / refit when becoming visible
  useEffect(() => {
    if (visible) {
      setTimeout(() => fitAndResize(), 50);
    }
  }, [visible, fitAndResize]);

  // Optional: if xterm itself emits resize (not strictly needed but safe)
  useEffect(() => {
    const term = terminalInstanceRef.current;
    if (!term) return;
    const disp = term.onResize(() => sendResize());
    return () => disp.dispose();
  }, [sendResize, isTerminalReady]);

  if (!visible) return null;

  return (
    <div className="h-full w-full bg-[#1e1e1e] flex flex-col min-h-0">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#2d2d30] border-b border-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-sm font-medium text-blue-300">
            Terminal - {projectId}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Ctrl+C to interrupt</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div
          ref={terminalRef}
          className="w-full h-full"
          style={{
            padding: '8px',
            backgroundColor: '#1e1e1e',
            fontFamily: 'Fira Mono, Menlo, Monaco, "Ubuntu Mono", monospace'
          }}
        />
      </div>
    </div>
  );
};

export default TerminalComponent;