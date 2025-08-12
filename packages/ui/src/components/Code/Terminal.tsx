import { useEffect, useRef, useState } from "react";
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
  const [isTerminalReady, setIsTerminalReady] = useState(false);

  useEffect(() => {
    if (!terminalRef.current || !visible) return;

    // Create terminal instance
    const term = new Terminal(OPTIONS_TERM);
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const searchAddon = new SearchAddon();

    // Load addons
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.loadAddon(searchAddon);

    // Open terminal
    term.open(terminalRef.current);
    fitAddon.fit();

    // Store references
    terminalInstanceRef.current = term;
    fitAddonRef.current = fitAddon;

    // Welcome message
    term.writeln('\x1b[32m╭─────────────────────────────────────╮\x1b[0m');
    term.writeln('\x1b[32m│          DevZen Terminal           │\x1b[0m');
    term.writeln('\x1b[32m╰─────────────────────────────────────╯\x1b[0m');
    term.writeln('');
    term.writeln('\x1b[36mConnecting to terminal...\x1b[0m');

    setIsTerminalReady(true);

    // Handle terminal input
    const handleData = (data: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: MESSAGE_UPDATE_TERMINAL,
          payload: { data }
        }));
      }
    };

    term.onData(handleData);

    // Handle resize
    const handleResize = () => {
      if (fitAddon) {
        setTimeout(() => {
          fitAddon.fit();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      terminalInstanceRef.current = null;
      fitAddonRef.current = null;
      setIsTerminalReady(false);
    };
  }, [visible, socket, projectId]);

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

  // Handle fit when visibility changes
  useEffect(() => {
    if (visible && fitAddonRef.current && terminalInstanceRef.current) {
      setTimeout(() => {
        fitAddonRef.current?.fit();
      }, 100);
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className="h-full w-full bg-[#1e1e1e] flex flex-col">
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
      <div className="flex-1 overflow-hidden">
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