# ArenaHub — Multi-Tenant Esports Tournament Platform

Full-stack implementation of the supplied ArenaHub SRS v1.0. The SRS specifies React 18, Node.js/Express, PostgreSQL 14+, JWT, Socket.IO, Docker and layered MVC/repository architecture. ArenaHub covers multi-host isolation, six roles, tournament lifecycle, team rosters, single-elimination brackets with byes, match confirmation/disputes, referee resolution, notifications and platform administration.

## Stack
- Frontend: React 18 + Vite + React Router
- Backend: Node.js + Express + PostgreSQL + Socket.IO
- Auth: bcrypt + JWT
- Architecture: routes → controllers → services → repositories
- Database: PostgreSQL, tenant scoped through `org_id`
- Deployment: Docker Compose for PostgreSQL; backend/frontend can be containerized separately

## Run locally
1. Copy `.env.example` to `backend/.env` and adjust secrets if required.
2. Start PostgreSQL:
   `docker compose up -d db`
3. Install dependencies:
   `npm run install:all`
4. Start both apps:
   `npm run dev`
5. Open `http://localhost:5173`.

Backend API runs at `http://localhost:5000/api`.

## Demo accounts
The seed creates a platform admin and sample organization. Password for all seeded demo users is `Password123!`.
- Admin: `admin@arenahub.local`
- Organizer: `organizer@campus.local`
- Captain A: `captain1@campus.local`
- Captain B: `captain2@campus.local`
- Referee: `referee@campus.local`
- Player: `player@campus.local`

## Notes
- The application intentionally implements only single-elimination because tournament formats beyond that are explicitly out of scope in the supplied SRS.
- Payments, streaming/voice, and native mobile apps are not implemented because the SRS marks them out of scope.
- HTTPS/TLS is a deployment concern; production should terminate TLS at the hosting proxy/load balancer.
- Socket.IO broadcasts bracket/match updates to connected clients in the relevant organization room.

## Core API
`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/me`

`GET/POST /api/organizations`, `POST /api/organizations/:id/members`

`GET/POST /api/tournaments`, `GET /api/tournaments/:id`, `PATCH /api/tournaments/:id`, `POST /api/tournaments/:id/open`, `POST /api/tournaments/:id/close`, `POST /api/tournaments/:id/start`

`GET/POST /api/tournaments/:id/teams`, `POST /api/teams/:id/players`, `DELETE /api/teams/:id/players/:userId`

`POST /api/tournaments/:id/bracket/generate`, `GET /api/tournaments/:id/bracket`

`POST /api/matches/:id/start`, `POST /api/matches/:id/result`, `POST /api/matches/:id/confirm`, `POST /api/matches/:id/dispute`, `POST /api/disputes/:id/resolve`

`GET /api/notifications`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all`

`GET /api/admin/stats`, `PATCH /api/admin/organizations/:id/status`
