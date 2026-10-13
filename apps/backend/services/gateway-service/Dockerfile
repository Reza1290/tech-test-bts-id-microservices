FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.json ./
COPY apps/ apps/
COPY docs/ docs/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bts/core-models build
RUN pnpm --filter @bts/http build
RUN pnpm --filter @bts/gateway-service build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/apps/ ./apps/
COPY --from=builder /app/docs/ ./docs/

EXPOSE 3000
CMD ["node", "apps/backend/services/gateway-service/dist/server.js"]
