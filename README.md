# 🚀 DevZEN

> **Cloud-native collaborative IDE with AI assistance, real-time coding, and VS Code experience in the browser.**

![Monaco Editor](https://img.shields.io/badge/Editor-Monaco-blue)
![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-green)
![Status](https://img.shields.io/badge/Status-Actively%20Building-yellow)

---

## 🧠 What is DevZEN?

**DevZEN** is a browser-based IDE designed for real-world development workflows.  
It brings real-time collaboration, a smart AI assistant, and full-stack coding power into a single cloud-native developer workspace.

Built on top of **Monaco Editor**, **Next.js**, and **Turborepo**, with powerful backend architecture and terminal support.

---

## 📦 Monorepo Structure (Turborepo)

```
devzen/
├── apps/
│   ├── web/         # Next.js frontend (Monaco + ShadCN UI)
│   ├── backend/     # Socket connections (collaboration backend)
│   └── server/      # Express backend (S3 + AI assistant handling)
├── packages/
│   └── db/          # Prisma schema, migrations, and client
├── .env             # Environment config
└── docker-compose.yml
```

---

## 🛠️ Getting Started (Dev Setup)

### ✅ 1. Install dependencies from root
```bash
pnpm install
```

### ✅ 2. Start supporting services (PostgreSQL, etc.)
```bash
docker compose up
```

### ✅ 3. Set up database
```bash
cd packages/db/
npx prisma migrate dev
npx prisma generate
```

### ✅ 4. Build the backend services
```bash
cd ../../apps/backend
pnpm tsbuild

cd ../server
pnpm tsbuild
```

### ✅ 5. Start all apps (frontend + backend + services)
```bash
cd ../../
pnpm dev
```

This will start:

- 🖥️ Web at [http://localhost:3000](http://localhost:3000)
- ⚙️ Backend at port `8080`
- 🧠 Server (AI + S3 handler) at port `8000`

---

## 🏗️ Project Architecture & Flow

### High-Level Architecture

- **Frontend (`apps/web/`)**  
  Next.js app with Monaco Editor, file explorer, and terminal UI. Communicates with backend via REST and WebSockets.

- **Backend (`apps/backend/`)**  
  Node.js server using WebSockets for real-time file system operations, project workspace management, and PTY terminal streaming.

- **Server (`apps/server/`)**  
  Express.js server for project provisioning, S3 file management, and (future) AI assistant endpoints.

- **Database (`packages/db/`)**  
  PostgreSQL managed via Prisma ORM. Stores users, projects, templates, and share codes.

- **Monorepo (Turborepo)**  
  Orchestrates builds, linting, and dependency management across all apps and packages.

---

### Project Flow

1. **Authentication**  
   Users must sign in to access their dashboard and projects.

2. **Project Creation**  
   - User creates a project from a template.
   - Backend provisions workspace, copies starter code from S3, and sets up the project directory.

3. **Workspace Initialization**  
   - Frontend connects to backend via WebSocket.
   - File tree is loaded and sent to the client.
   - Monaco Editor is initialized.

4. **File System Operations**  
   - Users create, rename, and delete files/folders.
   - Actions are sent over WebSocket to backend, which updates the workspace and persists changes.
   - **File data is sent after compressing and then decompressed on the receiving end** to optimize transfer and storage.

5. **Code Editing**  
   - Files are edited in Monaco Editor.
   - Changes are sent to backend and saved.
   - **Live multi-user editing is not implemented**; only one user edits at a time.

6. **Terminal Access**  
   - Each project has a dedicated PTY terminal, streamed over WebSocket.

7. **Project Sharing**  
   - Users can generate a share link for their project.
   - Anyone with the link can access the project in restricted mode.

---

### ❌ Skipped / Not Yet Implemented

- **Live Collaboration:**  
  Real-time, multi-user editing (like VS Code Live Share) is **not yet implemented**. Only one user edits at a time; changes are not broadcast live to other sessions.

- **AI Assistant:**  
  Context-aware AI code suggestions are planned but not yet available.

- **Advanced Access Controls:**  
  More granular permissions and workspace roles are planned for future releases.

---

## 🧩 Features

- 🔁 Real-time collaboration using WebSockets
- 👨‍💻 Monaco Editor with file explorer, terminal, and themes
- 🧠 Context-aware AI assistant (WIP)
- 📁 File system interaction with backend sync
- 🐚 Bash shell access via PTY (node-pty)
- ☁️ Docker + K8s-ready architecture

---

## 🌍 Tech Stack

| Layer      | Stack                                       |
|------------|---------------------------------------------|
| Frontend   | Next.js, TailwindCSS, ShadCN UI, Monaco     |
| Backend    | Express.js, Node.js, WebSockets, PTY        |
| Database   | PostgreSQL via Prisma ORM                   |
| DevOps     | Docker Compose, Kubernetes (WIP), PNPM      |
| Infra      | Turborepo (monorepo orchestration)          |

---

## 🤝 Contributing

This is currently a private solo-built project.  
External contributions are **invite-only**.

If you're contributing as a freelancer or invited dev:

- Work in feature branches
- Open a PR for review (no direct push to `main`)
- Stick to existing code style and structure

---

## 🚧 Work in Progress

- [ ] AI assistant logic with in-editor suggestions
- [ ] Terminal state persistence
- [ ] Live file sync across sessions
- [ ] Workspace sharing & access controls
- [ ] Full CI/CD + K8s deployment

---

## 🙌 Made by Ashwin Rai

Built from scratch with the intent to replace clunky coding sandboxes with something real devs can trust.
