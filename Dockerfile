# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"
RUN corepack enable pnpm
RUN apk add libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM node:22-alpine AS runner
RUN apk add libc6-compat curl
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=${PORT:-3000}
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE ${PORT}
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD sh -c "curl -f http://localhost:${PORT}/ || exit 1"
CMD ["node", "server.js"]