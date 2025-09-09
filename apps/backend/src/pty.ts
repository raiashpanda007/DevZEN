import { spawn , IPty } from "node-pty";
import p from "path";

const SHELL = 'bash';
const homeDir = '/workspace';
const workspaceRoot = homeDir; // projects now directly under /workspace

type Session = {
  terminal: IPty;
  projectId: string;
};

export class TerminalManager {
  private sessions: Record<string, Session> = {};

  createPty(id: string, projectId: string, onData: (data: string, pid: number) => void): IPty {
    const cwd = p.join(workspaceRoot, projectId);
    const term = spawn(SHELL, [], {
      cols: 100,
      rows: 30,
      cwd,
      name: 'xterm-color',
      env: process.env,
    });

    term.onData((data: string) => {
      onData(data, term.pid);
    });

    term.onExit(() => {
      delete this.sessions[id];
    });

    this.sessions[id] = {
      terminal: term,
      projectId,
    };

    return term;
  }

  write(terminalId: string, data: string): void {
    this.sessions[terminalId]?.terminal.write(data);
  }

  resize(terminalId: string, cols: number, rows: number): void {
    const session = this.sessions[terminalId];
    if (session) {
      session.terminal.resize(cols, rows);
    }
  }

  clear(terminalId: string): void {
    const session = this.sessions[terminalId];
    if (session) {
      session.terminal.kill();
      delete this.sessions[terminalId];
    }
  }
}