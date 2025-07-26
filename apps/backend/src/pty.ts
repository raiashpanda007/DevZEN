import { spawn , IPty } from "node-pty";


const SHELL = 'bash';

type Session = {
  terminal: IPty;
  projectId: string;
};

export class TerminalManager {
  private sessions: Record<string, Session> = {};

  createPty(id: string, projectId: string, onData: (data: string, pid: number) => void): IPty {
    const term = spawn(SHELL, [], {
      cols: 100,
      rows: 30,
      cwd: `workspace/${projectId}`,
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

  clear(terminalId: string): void {
    const session = this.sessions[terminalId];
    if (session) {
      session.terminal.kill();
      delete this.sessions[terminalId];
    }
  }
}