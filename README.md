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
