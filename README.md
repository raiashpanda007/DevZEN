# 🚀 DevZEN

DevZEN is a cloud-native, browser-first IDE that brings a full development workspace (Monaco editor, file explorer, terminal) to the browser. It is built as a Turborepo monorepo and combines a Next.js frontend, a WebSocket-based backend for live workspace operations and PTY streaming, and an Express server for provisioning and S3 interactions.

This README summarizes the architecture, runtime flow, infrastructure (Docker + Kubernetes), and how to get the project running locally. It also highlights a planned AI agent named "Ashna" that will be integrated into the IDE.

---

## ✨ Highlights

- Frontend: [apps/web](apps/web) — Next.js + Monaco Editor + ShadCN UI  
- Backend: [apps/backend/src/index.ts](apps/backend/src/index.ts) — WebSocket server handling file ops and PTY terminals  
- Server (provisioning / S3): [apps/Server/src/index.ts](apps/Server/src/index.ts) — Express endpoints to create/start projects and copy templates from S3  
- Types & shared schemas: [`CreateProjectSchema`](packages/types/src/Schema/CreateProjectSchema.ts) and [`Messages`](packages/types/src/Messages.ts)  
 - Jobs: [apps/Jobs](apps/Jobs) — background utilities for Kubernetes jobs and scheduled tasks
- DB: [packages/db/prisma/schema.prisma](packages/db/prisma/schema.prisma) — Prisma schema for users & projects  
- S3 & workspace utilities (backend): [apps/backend/src/awsS3files.ts](apps/backend/src/awsS3files.ts) and [apps/backend/src/filesSystem.ts](apps/backend/src/filesSystem.ts)  
- K8s manifests: [apps/Server/k8s/services.yml](apps/Server/k8s/services.yml)  
- Containerization: [Dockerfile](Dockerfile) and [docker-compose.yml](docker-compose.yml)

---

## 🏗️ High-level flow

1. User interacts with the Next.js frontend ([apps/web](apps/web)):
   - Browses projects, creates new projects, opens the editor and terminal.
2. Project creation (frontend → server):
   - Frontend posts to the Server API ([apps/Server/src/index.ts](apps/Server/src/index.ts)). Server copies starter code from S3 (via `copyFolder`) to code storage then prepares Kubernetes manifests.
   - Schema validation uses [`CreateProjectSchema`](packages/types/src/Schema/CreateProjectSchema.ts).
3. Provisioning & starting:
   - The Server replaces placeholders in [apps/Server/k8s/services.yml](apps/Server/k8s/services.yml) and creates the required Kubernetes resources (Deployment / Service / Ingress).
4. Workspace runtime:
   - The Kubernetes pod for the project runs the backend image which mounts a workspace volume and exposes a WebSocket endpoint.
   - Frontend connects to the backend WebSocket ([apps/backend/src/index.ts](apps/backend/src/index.ts)) for:
     - File tree fetch / file content fetch / CRUD operations (messages defined in [`Messages`](packages/types/src/Messages.ts))
     - Terminal (PTY) streaming
     - Periodic upload of compressed workspace to S3 (see [apps/backend/src/awsS3files.ts](apps/backend/src/awsS3files.ts) and [apps/backend/src/filesSystem.ts](apps/backend/src/filesSystem.ts))
5. Persistence & backups:
   - Backend compresses project folders into zip files and uploads them to S3; Server can rehydrate projects from S3 when provisioning.

---

## 🤖 Ashna — AI agent (coming soon)

Work is in progress to integrate an AI assistant named **Ashna** into the editor.

- Ashna will review code and will not provide any kind of suggestion to the user.
- Ashna may be able to build complete features end-to-end using MCP and related automation flows (scaffolding, wiring services, tests and deployment manifests).
- Integration points are planned in the frontend and server: an assistant endpoint can be added in [apps/Server/src/index.ts](apps/Server/src/index.ts) and surfaced in the editor UI in [apps/web](apps/web).

Note: the current monorepo layout and server endpoints are prepared so Ashna can be added later as an automation-focused agent rather than an interactive suggester.


---

## 🐳 Docker & ☸️ Kubernetes

- Docker:
  - The project provides a multi-stage [Dockerfile](Dockerfile) to build backend artifacts and produce a production image.
  - Use [docker-compose.yml](docker-compose.yml) for local services (Postgres, Redis).
- Kubernetes:
  - Production-grade manifests live in [apps/Server/k8s/services.yml](apps/Server/k8s/services.yml).
  - The Server replaces `service_name` with each project ID and creates Deployments, Services, and Ingress with WebSocket and long-timeout annotations.
  - Ingress config enables WebSocket proxying (e.g., `nginx.ingress.kubernetes.io/enable-websocket: "true"`).

---

## ⚙️ Local development — quick start

1. Install dependencies (root):
```bash
pnpm install
```

2. Start local infrastructure:
```bash
docker compose up -d
# Wait for Postgres and Redis to be ready
```

3. Setup database (Prisma):
```bash
cd packages/db
npx prisma migrate dev
npx prisma generate
cd ../../
```

4. Build backend services:
```bash
cd apps/backend
pnpm tsbuild
cd ../server
pnpm tsbuild
cd ../../
```

5. Run everything in development:
```bash
pnpm dev
```

- Frontend runs at http://localhost:3000 ([apps/web package.json scripts](apps/web/package.json)).
- Backend listens on port 8080 ([apps/backend/src/index.ts](apps/backend/src/index.ts)).
- Server listens on port 3001/8000 depending on env ([apps/Server/src/index.ts](apps/Server/src/index.ts)).

See the root [package.json](package.json) for turbo scripts and monorepo tooling.

---

## 🔐 Environment & secrets

- Local `.env` files are used for secrets and credentials. For S3 and Kubernetes, the Server and backend expect AWS credentials (see [apps/backend/src/awsS3files.ts](apps/backend/src/awsS3files.ts)).
- When deploying to Kubernetes, make sure to create secrets (example: `aws-secret-prod`) referenced in [apps/Server/k8s/services.yml](apps/Server/k8s/services.yml).

---

## 📁 Important files & symbols

- Project entry points
  - [apps/web](apps/web)
  - [apps/backend/src/index.ts](apps/backend/src/index.ts)
  - [apps/Server/src/index.ts](apps/Server/src/index.ts)
- Shared types & schemas
  - [`CreateProjectSchema`](packages/types/src/Schema/CreateProjectSchema.ts)
  - [`Messages`](packages/types/src/Messages.ts)
  - [`Type` enum](packages/types/src/index.ts)
- Workspace persistence utilities
  - [apps/backend/src/awsS3files.ts](apps/backend/src/awsS3files.ts)
  - [apps/backend/src/filesSystem.ts](apps/backend/src/filesSystem.ts)
- Infrastructure
  - [Dockerfile](Dockerfile)
  - [docker-compose.yml](docker-compose.yml)
  - [apps/Server/k8s/services.yml](apps/Server/k8s/services.yml)

## 🛠️ Jobs (background workers & k8s utilities)

The `apps/Jobs` package contains background utilities and scheduled tasks that interact with Kubernetes and the cluster environment. It's intended for housekeeping, monitoring, and automation jobs the platform runs on a schedule or on-demand.

Key files and purpose:

- `.env` — environment variables used by the jobs (cron schedules, cluster connection settings, feature flags).
- `k8sConfig.ts` — helpers to build or transform Kubernetes manifests and config used by jobs or provisioning flows.
- `src/index.ts` — job entrypoint which registers scheduled tasks or exposes a CLI to run specific jobs.
- `src/controllers/cleaner.ts` — cleanup tasks (for example removing stale pods, orphaned volumes, or temporary workspaces).
- `src/controllers/getAllpods.ts` — utilities to query the cluster for pod status and emit metrics or alerts.
- `src/utils/` — shared helpers used by the job controllers.

Typical uses:

- Run periodic cleanup of stale resources created by temporary workspaces.
- Collect and report cluster state (pods, resource usage) for observability.
- Generate or validate Kubernetes manifests used by the Server when provisioning project workspaces.

Quick local run (assumptions: `pnpm` is used across the monorepo and `apps/Jobs/package.json` exposes common scripts):

```bash
cd apps/Jobs
pnpm install
# run in dev (if script exists)
pnpm dev || pnpm start || node dist/index.js
```

If the package uses TypeScript build step, run `pnpm build` then `node dist/index.js`. If you want the Jobs package to run against a real Kubernetes cluster, configure kubeconfig or point the environment at a test cluster.

Note: I used the actual `apps/Jobs` structure in the repo to summarize responsibilities and made a small, conservative assumption about script names (`dev`, `start`, `build`) common in this monorepo; adjust the commands to the exact scripts in `apps/Jobs/package.json` if they differ.

---

## 🧭 Troubleshooting tips

- WebSocket connection issues: confirm the backend is reachable and Ingress or proxy supports WebSocket upgrade. Check `nginx` ingress annotations in [apps/Server/k8s/services.yml](apps/Server/k8s/services.yml).
- S3 uploads/downloads: verify AWS env vars and secrets used by backend ([apps/backend/src/awsS3files.ts](apps/backend/src/awsS3files.ts)).
- Prisma / DB errors: ensure Postgres in docker-compose is up and [packages/db/prisma/schema.prisma](packages/db/prisma/schema.prisma) migrations have run.

---

## ❤️ Contributing

- Work in feature branches, open a PR to `main`.
- Keep changes scoped to one package/app when possible.
- Run linting and tests via turbo scripts in the root [package.json](package.json).

---
