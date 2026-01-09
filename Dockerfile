# syntax=docker.io/docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Set a dummy/default DB URL during build to prevent failures during page data collection
ENV NEXT_PUBLIC_DATABASE_URL=file:db/local.db
RUN corepack enable pnpm && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
RUN apk add --no-cache libc6-compat curl
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=${HOSTNAME:-0.0.0.0}
ENV PORT=${PORT:-3000}
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE ${PORT}
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD sh -c "curl -f http://localhost:${PORT}/ || exit 1"
CMD ["node", "server.js"]