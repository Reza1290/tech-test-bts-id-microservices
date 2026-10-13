# tech-test-bts-id-microservices

Recruitment Test: Backend Developer Coding Test (PT INTERSOLUSI TEKNOLOGI ASIA / BTS.id).

This project implements a decoupled, high-performance microservices backend using Hexagonal Architecture (Ports and Adapters), PostgreSQL decentralized databases via Drizzle ORM, API Gateway pattern, rate limiting, and in-memory caching.

## Features & Implementation

### 1. Authentication Service (`/api/auth`)
- `POST /api/auth/register`: Register new user (`username`, `password`, `password_confirmation`).
- `POST /api/auth/login`: Authenticate and issue JWT `authentication_token` (expires in 1 hour) and `refresh_token` (expires in 7 days).
- **Rate Limiting:** Maximum 3 requests per 60 seconds.

### 2. Product Management Service (`/api/products`)
- `GET /api/products`: Retrieve paginated products with query filters (`?search=keyword`, `?category=Clothes`, `?page=1&limit=10`).
- `GET /api/products/:id`: Retrieve single product details with JSON 404 error handling.
- `POST /api/products`: Create a product with mandatory validation (`title`, `price`, `category`, `images` >= 1). Protected by Bearer authentication. Populates audit fields (`created_by`, `created_by_id`, `updated_by`, `updated_by_id`, `created_at`, `updated_at`).
- `PUT /api/products/:id`: Update existing product. Protected by Bearer authentication.
- `DELETE /api/products/:id`: Delete product by ID. Protected by Bearer authentication.
- **Rate Limiting:** Maximum 1 request per 5 seconds on mutations (`POST`, `PUT`, `DELETE`).
- **Caching:** In-memory TTL cache (60 seconds) with automatic invalidation upon product mutations.

### 3. Cross-Cutting & Delivery Capabilities
- **Decentralized Databases:** Separate PostgreSQL databases for auth (`bts_auth`) and products (`bts_products`).
- **CORS Support:** Globally enabled to allow web clients from any domain.
- **Docker Support:** Full multi-container orchestration with Docker Compose.
- **Architecture Integrity:** AST-based Hexagonal Architecture validation script (`scripts/check-technical-architecture.mjs`).
- **API Documentation:** OpenAPI 3.0 specification (`docs/swagger.yaml`), Swagger UI (`/api/docs`), and Postman collection (`docs/bts-id.postman_collection.json`).

## Architecture Layout

```text
tech-test-bts-id-microservices/
├── apps/
│   ├── backend/
│   │   └── services/
│   │       ├── gateway-service/     # API Gateway, Auth, Rate Limiter, Reverse Proxy (Port 3000)
│   │       └── product-service/     # Product Catalog, Cache, CRUD Use Cases (Port 3001)
│   └── packages/
│       ├── core-models/             # Shared contracts, DTOs, and Zod schemas
│       └── http/                    # Framework-agnostic HTTP adapters, BaseController, helpers
├── docker/
│   ├── init-databases.sh            # Container database entrypoint initialization
├── docs/
│   ├── swagger.yaml                 # OpenAPI 3.0 specification
│   └── bts-id.postman_collection.json # Postman collection
├── scripts/
│   └── check-technical-architecture.mjs  # Hexagonal Architecture validator
├── tests/                           # Unit and contract tests
├── docker-compose.yml               # Multi-service container orchestration
├── Makefile                         # Unified development shortcuts
├── package.json                     # Monorepo root configuration
├── pnpm-workspace.yaml              # Workspace package definitions
├── prd.md                           # Comprehensive Product Requirements Document
└── tsconfig.json                    # Base TypeScript compiler options
```

## Quick Start

### Option 1: Run via Docker Compose (Recommended)

1. Start all containers (Postgres, Gateway, Product Service):
   ```bash
   make docker-up
   # or: docker compose up -d --build
   ```

2. Access endpoints:
   - **API Gateway:** `http://localhost:3000`
   - **Swagger UI:** `http://localhost:3000/api/docs`
   - **Product Service:** `http://localhost:3001`
   - **PostgreSQL:** `localhost:5432`

3. Stop containers:
   ```bash
   make docker-down
   ```

### Option 2: Run Locally (Without Docker)

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

3. **Start PostgreSQL & Push Database Schema:**
   Ensure PostgreSQL is running on port 5432 with databases `bts_auth` and `bts_products`.
   You can run `docker compose up postgres -d` to start only the database container.
   Synchronize database schemas using Drizzle:
   ```bash
   pnpm db:push
   # or: make db-push
   ```

4. **Start microservices:**
   ```bash
   pnpm dev
   ```

## Database Schema Synchronization (`db:push`)

This project uses Drizzle ORM to manage database models. To synchronize schema definitions directly to PostgreSQL databases (`bts_auth` and `bts_products`):

```bash
pnpm db:push
# or: make db-push
```

To run schema push for a specific service:
```bash
pnpm --filter @bts/gateway-service db:push
pnpm --filter @bts/product-service db:push
```

## Available Make Commands

| Command | Description |
| --- | --- |
| `make install` | Install all dependencies across workspace |
| `make dev` | Start all microservices in parallel via Turborepo |
| `make dev-gateway` | Start API Gateway only (Port 3000) |
| `make dev-product` | Start Product Service only (Port 3001) |
| `make build` | Compile all TypeScript packages |
| `make test` | Run all test suites |
| `make check-architecture` | Validate Hexagonal Architecture boundaries |
| `make db-push` | Push Drizzle schema to PostgreSQL databases |
| `make docker-up` | Build and start containerized stack |
| `make docker-down` | Stop running containers |
| `make docker-logs` | Stream container logs |
| `make clean` | Clean build artifacts and dependencies |

## API Endpoints Summary

| Method | Endpoint | Auth | Rate Limit | Description |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | 3x / 60s | Register new user account |
| POST | `/api/auth/login` | Public | 3x / 60s | Authenticate user and receive tokens |
| GET | `/api/products` | Public | None | List products with search, category, pagination |
| GET | `/api/products/:id` | Public | None | Get product detail |
| POST | `/api/products` | Bearer | 1x / 5s | Create new product |
| PUT | `/api/products/:id` | Bearer | 1x / 5s | Update existing product |
| DELETE | `/api/products/:id` | Bearer | 1x / 5s | Delete product by ID |
| GET | `/api/docs` | Public | None | Interactive Swagger UI documentation |

## Quality & Verification

Run the AST-based architecture check:
```bash
pnpm check:architecture
```

Run test suite:
```bash
pnpm test
```
