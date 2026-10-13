# Product Requirements Document (PRD)

## Project: BTS.id Backend Developer Coding Test (Microservices)

- **Organization:** PT INTERSOLUSI TEKNOLOGI ASIA (BTS.id)
- **Role:** Backend Developer Recruitment Test
- **Architecture:** Hexagonal Architecture (Ports and Adapters) Microservices Monorepo
- **Repository:** git@github.com:Reza1290/tech-test-bts-id-microservices.git

---

## 1. Executive Summary

This document specifies the technical and business requirements for the BTS.id Backend Developer Coding Test. The goal is to deliver a production-grade, highly maintainable, and scalable RESTful API ecosystem using a decoupled microservices architecture based on Hexagonal Architecture (Clean Architecture / Ports and Adapters).

The system consists of:
1. **API Gateway & Authentication Service (`gateway-service`):** Handles user registration, authentication, JWT issuance (`authentication_token` and `refresh_token`), global rate limiting, CORS management, and reverse proxying to downstream domain services.
2. **Product Microservice (`product-service`):** Manages product catalog lifecycle, query filtering, pagination, caching, and authorized mutations.
3. **Shared Packages (`@template/http`, `@template/core-models`):** Framework-agnostic HTTP contracts, standard response builders, and Zod validation schemas.
4. **Decentralized Databases:** Independent PostgreSQL schemas per service (`bts_auth` and `bts_products`).

---

## 2. Functional Requirements

### 2.1 Authentication Service (`/api/auth`)

#### A. User Registration (`POST /api/auth/register`)
- **Description:** Registers a new user account.
- **Request Body Contract:**
  - `username` (string, required, minimum 3 characters, alphanumeric/underscores)
  - `password` (string, required, minimum 6 characters)
  - `password_confirmation` (string, required, must match `password`)
- **Business Logic:**
  - Validates that `password` equals `password_confirmation`.
  - Ensures `username` is unique across the system.
  - Hashes passwords using bcrypt (salt rounds >= 10).
- **Responses:**
  - `201 Created`: User successfully registered.
  - `400 Bad Request`: Validation failure (mismatched password confirmation, invalid schema).
  - `409 Conflict`: Username already registered.
  - `429 Too Many Requests`: Triggered when rate limit is exceeded.
- **Rate Limit (Optional Requirement):** Maximum 3 hits within 60 seconds per IP / client.

#### B. User Login (`POST /api/auth/login`)
- **Description:** Authenticates user credentials and issues tokens.
- **Request Body Contract:**
  - `username` (string, required)
  - `password` (string, required)
- **Business Logic:**
  - Verifies user existence and compares password hash.
  - On success, generates:
    - `authentication_token`: Short-lived access JWT (contains `sub`, `username`, `exp`).
    - `refresh_token`: Long-lived refresh token for session maintenance.
- **Response Format (`200 OK`):**
  ```json
  {
    "authentication_token": "<jwt_access_token>",
    "refresh_token": "<jwt_refresh_token>",
    "token_type": "Bearer",
    "expires_in": 3600
  }
  ```
- **Responses:**
  - `200 OK`: Successful authentication.
  - `400 Bad Request`: Missing credentials.
  - `401 Unauthorized`: Invalid username or password.
  - `429 Too Many Requests`: Exceeded 3 hits in 60 seconds.
- **Rate Limit (Optional Requirement):** Maximum 3 hits within 60 seconds per IP.

---

### 2.2 Product Management Service (`/api/products`)

#### Product Data Schema
```json
{
  "id": 1,
  "title": "Awesome T-Shirt",
  "price": 99.99,
  "description": "High-quality cotton t-shirt",
  "category": "Clothes",
  "images": [
    "https://placeimg.com/640/480/any"
  ],
  "created_at": "2025-01-01 15:01:04",
  "created_by": "Jhon Doe",
  "created_by_id": "1",
  "updated_at": "2025-01-01 15:01:04",
  "updated_by": "Jhon Doe",
  "updated_by_id": "1"
}
```

#### A. List All Products (`GET /api/products`)
- **Access Control:** Public.
- **Query Parameters:**
  - `search` (string, optional): Search by product title (case-insensitive substring match).
  - `category` (string, optional): Filter by exact category name.
  - `page` (integer, optional, default: 1): Current page index.
  - `limit` (integer, optional, default: 10): Items per page.
- **Response Format (`200 OK`):**
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "Awesome T-Shirt",
        "price": 99.99,
        "description": "High-quality cotton t-shirt",
        "category": "Clothes",
        "images": ["https://placeimg.com/640/480/any"],
        "created_at": "2025-01-01 15:01:04",
        "created_by": "Jhon Doe",
        "created_by_id": "1",
        "updated_at": "2025-01-01 15:01:04",
        "updated_by": "Jhon Doe",
        "updated_by_id": "1"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "total_pages": 1
    }
  }
  ```
- **Caching (Optional Requirement):** In-memory cache keyed by query string (`products:page:limit:search:category`), default TTL 60 seconds.

#### B. Get Product Detail (`GET /api/products/:id`)
- **Access Control:** Public.
- **Path Parameter:** `id` (integer or valid ID format).
- **Responses:**
  - `200 OK`: Single product object matching the schema.
  - `404 Not Found`:
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Product with ID 1 was not found"
    }
    ```
- **Caching (Optional Requirement):** Cache keyed by `product:detail:<id>`, default TTL 60 seconds. Cache invalidated upon product update or deletion.

#### C. Create New Product (`POST /api/products`)
- **Access Control:** Protected. Requires valid `Authorization: Bearer <authentication_token>`.
- **Validation Rules:**
  - `title` (string, required, non-empty)
  - `price` (number, required, positive)
  - `category` (string, required, non-empty)
  - `images` (array of strings / valid URLs, required, minimum 1 item)
  - `description` (string, optional)
- **Audit Field Population:**
  - `created_by`: Populated from authenticated token username.
  - `created_by_id`: Populated from authenticated token user ID (`sub`).
  - `updated_by`: Populated from authenticated token username.
  - `updated_by_id`: Populated from authenticated token user ID (`sub`).
  - `created_at` & `updated_at`: Formatted as `YYYY-MM-DD HH:mm:ss`.
- **Responses:**
  - `201 Created`: Newly created product object.
  - `400 Bad Request`: Validation failure.
  - `401 Unauthorized`: Missing or invalid Bearer token.
  - `429 Too Many Requests`: Exceeded 1 request per 5 seconds.
- **Rate Limit (Optional Requirement):** Maximum 1 request every 5 seconds per authenticated user / client.

#### D. Update Product (`PUT /api/products/:id`)
- **Access Control:** Protected. Requires valid `Authorization: Bearer <authentication_token>`.
- **Path Parameter:** `id` (integer).
- **Request Body:** Partial or complete product fields (`title`, `price`, `description`, `category`, `images`).
- **Audit Field Population:**
  - `updated_by`: Populated from authenticated token username.
  - `updated_by_id`: Populated from authenticated token user ID (`sub`).
  - `updated_at`: Current timestamp.
- **Cache Invalidation:** Clears detail cache for `:id` and list caches.
- **Responses:**
  - `200 OK`: Updated product object.
  - `400 Bad Request`: Invalid payload.
  - `401 Unauthorized`: Missing or invalid authorization.
  - `404 Not Found`: Product ID not found.
  - `429 Too Many Requests`: Exceeded 1 request per 5 seconds.
- **Rate Limit (Optional Requirement):** Maximum 1 request every 5 seconds.

#### E. Delete Product (`DELETE /api/products/:id`)
- **Access Control:** Protected. Requires valid `Authorization: Bearer <authentication_token>`.
- **Path Parameter:** `id` (integer).
- **Cache Invalidation:** Clears product detail cache and list caches.
- **Responses:**
  - `200 OK` or `204 No Content`: Product deleted successfully.
  - `401 Unauthorized`: Missing or invalid authorization.
  - `404 Not Found`: Product ID does not exist.
  - `429 Too Many Requests`: Exceeded 1 request per 5 seconds.
- **Rate Limit (Optional Requirement):** Maximum 1 request every 5 seconds.

---

## 3. Architecture & System Design

### 3.1 Hexagonal Architecture (Ports and Adapters)

Every microservice isolates its domain from frameworks and external drivers:

```text
┌────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                 │
│  - Express HTTP Controllers (BaseController)           │
│  - Zod Request Parsers                                 │
│  - Drizzle ORM Schema & PostgreSQL Repositories        │
│  - In-Memory Cache Driver                              │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │               Application Layer                │   │
│   │   - Inbound Ports: Use Case Interactors        │   │
│   │   - Outbound Ports: Repository Interfaces      │   │
│   │                                                │   │
│   │   ┌────────────────────────────────────────┐   │   │
│   │   │             Domain Layer               │   │   │
│   │   │  - Product / User Entities             │   │   │
│   │   │  - Domain Value Objects                │   │   │
│   │   │  - Pure Domain Errors                  │   │   │
│   │   └────────────────────────────────────────┘   │   │
│   └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

### 3.2 Monorepo Layout

```text
tech-test-bts-id-microservices/
├── apps/
│   ├── backend/
│   │   ├── init-databases.sql       # SQL script initializing bts_auth and bts_products
│   │   └── services/
│   │       ├── gateway-service/     # API Gateway, Auth, Rate Limiter, Reverse Proxy (Port 3000)
│   │       └── product-service/     # Product Catalog, Cache, CRUD Use Cases (Port 3001)
│   └── packages/
│       ├── core-models/             # Shared TypeScript models, contracts, Zod schemas
│       └── http/                    # Shared HTTP contracts, BaseController, response helpers
├── docker/
│   ├── init-databases.sh            # Docker entrypoint Postgres DB creator
│   └── nginx/conf.d/                # Nginx proxy configuration
├── docs/
│   ├── swagger.yaml                 # OpenAPI 3.0 documentation
│   └── postman_collection.json      # Postman test collection
├── scripts/
│   └── check-technical-architecture.mjs  # AST architecture validator
├── docker-compose.yml               # Multi-service container orchestration
├── Makefile                         # Unified development commands
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── turbo.json
├── prd.md
└── README.md
```

### 3.3 Database Design

#### A. Service `gateway-service` (`bts_auth` database)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### B. Service `product-service` (`bts_products` database)

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at VARCHAR(30) NOT NULL,
  created_by VARCHAR(100) NOT NULL,
  created_by_id VARCHAR(50) NOT NULL,
  updated_at VARCHAR(30) NOT NULL,
  updated_by VARCHAR(100) NOT NULL,
  updated_by_id VARCHAR(50) NOT NULL
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_title ON products(title);
```

---

## 4. Cross-Cutting Concerns

### 4.1 CORS Support
- The API Gateway enables CORS with `Access-Control-Allow-Origin: *` (or dynamically configurable via `ALLOWED_ORIGINS` environment variable) to permit web clients from any origin to interact seamlessly with all endpoints.

### 4.2 Rate Limiting (Express Rate Limit)
- **Auth Routes (`/api/auth/*`):** Window: 60 seconds, Max: 3 requests per IP.
- **Product Mutation Routes (`POST|PUT|DELETE /api/products*`):** Window: 5 seconds, Max: 1 request per IP / token.
- Returns status `429 Too Many Requests` with standard JSON payload upon violation.

### 4.3 Caching Mechanism
- In-memory cache implementation with Time-To-Live (TTL = 60s).
- Query keys include pagination and filters to prevent stale or conflicting reads.
- Cache invalidation occurs on any mutating action (`POST`, `PUT`, `DELETE`).

---

## 5. Delivery Checklist

| Deliverable | Specification | Status |
| --- | --- | --- |
| Microservices Monorepo | Turborepo + pnpm workspaces | Ready |
| Architecture Integrity | Hexagonal Architecture verified via AST script | Enforced |
| REST API Products | GET, GET :id, POST, PUT, DELETE with query filters | Complete |
| REST API Auth | Register and Login with authentication_token and refresh_token | Complete |
| Rate Limiting | 3x/60s for Auth, 1x/5s for Mutations | Complete |
| Cache Implementation | TTL-based caching with invalidation | Complete |
| Docker Support | Docker Compose orchestration for Postgres, Gateway, Product service | Complete |
| CORS Configuration | Cross-origin access enabled for all web domains | Complete |
| Documentation | OpenAPI Swagger spec + Postman Collection | Complete |
| Git Repository | Public repository on GitHub (Reza1290/tech-test-bts-id-microservices) | Connected |
