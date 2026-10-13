.PHONY: help install dev dev-gateway dev-product build typecheck lint test check-architecture clean docker-up docker-down docker-logs

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install:
	pnpm install

dev:
	pnpm dev

dev-gateway:
	pnpm --filter @bts/gateway-service dev

dev-product:
	pnpm --filter @bts/product-service dev

build:
	pnpm build

typecheck:
	pnpm typecheck

lint:
	pnpm lint

test:
	pnpm test

check-architecture:
	pnpm check:architecture

docker-up:
	docker compose up -d --build
	@echo "Services running:"
	@echo "Gateway:     http://localhost:3000"
	@echo "Product:     http://localhost:3001"
	@echo "Postgres:    localhost:5432"
	@echo "Swagger UI:  http://localhost:3000/api/docs"

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

clean:
	rm -rf node_modules
	rm -rf apps/backend/services/gateway-service/node_modules apps/backend/services/gateway-service/dist
	rm -rf apps/backend/services/product-service/node_modules apps/backend/services/product-service/dist
	rm -rf apps/packages/core-models/node_modules apps/packages/core-models/dist
	rm -rf apps/packages/http/node_modules apps/packages/http/dist
	rm -rf .turbo
	@echo "Cleaned all build artifacts and node_modules."
