# House Rental Verification Platform - Deployment Guide

This guide outlines the steps to deploy the RentVerify platform in a production environment.

## 1. Prerequisites
- Docker & Docker Compose
- PostgreSQL Database
- S3 Compatible Storage (AWS S3, Cloudflare R2, or MinIO)
- SMS Gateway API Key (Twilio/Firebase)
- API SETU Credentials (for PAN verification)

## 2. Environment Variables
Create a `.env` file with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rentverify"
JWT_SECRET="your-secure-jwt-secret"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Storage
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
S3_REGION="auto"
S3_BUCKET="rentverify-assets"
S3_ENDPOINT="https://your-endpoint.com"

# Verification APIs
API_SETU_KEY="your-api-setu-key"
```

## 3. Docker Deployment
Use the provided `docker-compose.yml` to spin up the application and database.

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: rentverify
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## 4. Database Migration
Run Prisma migrations to set up the schema:
```bash
npx prisma migrate deploy
```

## 5. Security & Maintenance
- **Document Deletion**: A cron job should be set up to call the cleanup script every 24 hours.
- **SSL**: Use Nginx or Caddy as a reverse proxy with Let's Encrypt for HTTPS.
- **Backups**: Regularly backup the PostgreSQL database and S3 assets.

## 6. Production Build
```bash
npm run build
npm start
```
