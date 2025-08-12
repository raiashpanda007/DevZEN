FROM node:24-alpine3.21 AS builder

# Install pnpm and build dependencies
RUN npm install -g pnpm
RUN apk add --no-cache python3 make g++ bash

WORKDIR /app

# Copy all source code and config
COPY . .

# Only copy .env files that exist
COPY apps/backend/.env ./apps/backend/.env
COPY packages/db/.env ./packages/db/.env
# Do NOT copy .env for packages/types or packages/queue

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build only the backend app
RUN pnpm --filter ./apps/backend... build

# Production image
FROM node:24-alpine3.21 AS production

RUN npm install -g pnpm && \
    apk add --no-cache python3 make g++ bash && \
    addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001

WORKDIR /app

# Copy only what is needed for production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY packages/queue/package.json ./packages/queue/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/packages/db ./packages/db
COPY --from=builder /app/packages/types ./packages/types
COPY --from=builder /app/packages/queue ./packages/queue

# Only copy .env files that exist
COPY --from=builder /app/apps/backend/.env ./apps/backend/.env
COPY --from=builder /app/packages/db/.env ./packages/db/.env
# Do NOT copy .env for packages/types or packages/queue

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile && pnpm store prune && rm -rf /root/.pnpm-store

# Ensure /workspace directory exists
RUN mkdir -p /workspace

# Set permissions and user
RUN chown -R backend:nodejs /app /workspace
USER backend

EXPOSE 8080
WORKDIR /workspace
ENTRYPOINT ["node", "/app/apps/backend/dist/index.js"]