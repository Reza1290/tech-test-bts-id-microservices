FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/backend/services/product-service/package.json apps/backend/services/product-service/
COPY apps/packages/core-models/package.json apps/packages/core-models/
COPY apps/packages/http/package.json apps/packages/http/
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/services/product-service/node_modules ./apps/backend/services/product-service/node_modules
COPY --from=deps /app/apps/packages/core-models/node_modules ./apps/packages/core-models/node_modules
COPY --from=deps /app/apps/packages/http/node_modules ./apps/packages/http/node_modules
COPY package.json pnpm-workspace.yaml tsconfig.json ./
COPY apps/tsconfig.json apps/tsconfig.json
COPY apps/backend/services/product-service/ apps/backend/services/product-service/
COPY apps/packages/core-models/ apps/packages/core-models/
COPY apps/packages/http/ apps/packages/http/
RUN pnpm --filter @bts/core-models build
RUN pnpm --filter @bts/http build
RUN pnpm --filter @bts/product-service build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/services/product-service/node_modules ./apps/backend/services/product-service/node_modules
COPY --from=builder /app/apps/backend/services/product-service/dist ./apps/backend/services/product-service/dist
COPY --from=builder /app/apps/backend/services/product-service/package.json ./apps/backend/services/product-service/package.json
COPY --from=builder /app/apps/packages/core-models/ ./apps/packages/core-models/
COPY --from=builder /app/apps/packages/http/ ./apps/packages/http/
COPY pnpm-workspace.yaml package.json ./
EXPOSE 3001
CMD ["pnpm", "--filter", "@bts/product-service", "start"]
