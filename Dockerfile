# syntax=docker/dockerfile:1

# Production image of the console. It is built in GitHub Actions and published
# to GHCR: the server never compiles. The console is a static SPA, so the
# runtime is nginx serving the build (deploy/nginx.conf).
#
# The console calls the API on its own origin (/v1/...): the host nginx forwards
# /v1 to auth-api, so no API URL is baked into the build and no CORS is needed.

# ---- Build ----
FROM node:24-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# ---- Runtime ----
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runner
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/security-headers.inc /etc/nginx/security-headers.inc
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
