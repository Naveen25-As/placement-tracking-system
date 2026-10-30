# Placement Tracking System

Full-stack app for students to track placement applications and for admins to monitor users, placements and login activity.

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite 6, React Router 6, Axios (`frontend/`) |
| Backend | Java 17, Spring Boot 3.4, Spring Data JPA, Spring Security + JWT (`backend/`) |
| Database | MySQL 8 (`database/schema.sql` for reference; Hibernate creates tables automatically) |

## Features

- Register / login / logout with JWT (BCrypt-hashed passwords, login activity tracking)
- Students: dashboard stats, add / edit / delete / search / filter placement applications, profile
- Admins: dashboard, user management (view / delete), login activity (search, status and date filters), all placements
- Additional REST module: `/api/companies`, `/api/jobs`, `/api/applications`, `/api/profile`

## Prerequisites

- Java 17+, Node.js 18+ and npm, MySQL 8 running locally

## 1. Database

```sql
CREATE DATABASE IF NOT EXISTS placement_tracker;
CREATE USER IF NOT EXISTS 'pts'@'localhost' IDENTIFIED BY 'choose_a_password';
GRANT ALL PRIVILEGES ON placement_tracker.* TO 'pts'@'localhost';
```

Tables are created/updated on backend startup (`ddl-auto=update`); no data is dropped.

## 2. Backend (http://localhost:8080)

Create `backend/.env` (git-ignored, loaded automatically) or export the same variables:

```properties
DB_URL=jdbc:mysql://localhost:3306/placement_tracker?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=pts
DB_PASSWORD=choose_a_password
# Base64 key, at least 256 bits: openssl rand -base64 64
JWT_SECRET=<output of openssl rand -base64 64>
# Optional: creates an admin account on first start
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<strong password>
# Optional, comma-separated CORS origins (default http://localhost:5173)
FRONTEND_URL=http://localhost:5173
```

```bash
cd backend
./mvnw spring-boot:run          # or: ./mvnw package && java -jar target/placement-tracker-backend-1.0.0.jar
curl http://localhost:8080/api/health
```

## 3. Frontend (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev        # /api is proxied to http://localhost:8080
npm run build      # production build in dist/
```

For production set `VITE_API_BASE_URL` to the backend URL including `/api` (see `frontend/.env.example`).

## Deployment (Render)

`render.yaml` defines a Docker web service for the backend and a static site for the frontend. Set the backend variables above plus `FRONTEND_URL` (the static site URL), and `VITE_API_BASE_URL` on the frontend.

## API overview

| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` | public |
| GET | `/api/health` | public |
| GET/POST | `/api/placements` (`search`, `status`, `page`, `size`) | user |
| GET/PUT/DELETE | `/api/placements/{id}` | owner |
| GET | `/api/placements/stats` | user |
| GET/PUT | `/api/users/profile` | user |
| GET | `/api/admin/dashboard`, `/api/admin/users`, `/api/admin/users/{id}`, `/api/admin/login-activities`, `/api/admin/placements` | admin |
| DELETE | `/api/admin/users/{id}` | admin |

Errors use `{ "success": false, "message": "...", "data": {field: error} }` with 400 / 401 / 403 / 404 / 409 status codes.
