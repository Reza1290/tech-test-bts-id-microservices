#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 'CREATE DATABASE bts_auth' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'bts_auth')\gexec
    SELECT 'CREATE DATABASE bts_products' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'bts_products')\gexec
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "bts_auth" <<-EOSQL
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "bts_products" <<-EOSQL
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price NUMERIC(12, 2) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        images JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at VARCHAR(30) NOT NULL,
        created_by VARCHAR(100) NOT NULL,
        created_by_id VARCHAR(50) NOT NULL,
        updated_at VARCHAR(30) NOT NULL,
        updated_by VARCHAR(100) NOT NULL,
        updated_by_id VARCHAR(50) NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_title ON products(title);
EOSQL
