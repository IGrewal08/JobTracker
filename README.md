# JobTracker

A SaaS job tracker that automatically pulls live listings matching your criteria, so you find and track jobs in one place.

![preview](docs/Preview.gif)

## Live URL

[jobtracker.com](http://52.15.142.63) _(domain WIP)_

## Architecture diagram

![diagram](docs/diagram.png)

## Tech Stack

**Frontend**

- React + React Router v7 (SSR framework mode)
- TypeScript
- ReCharts
- Socket.io client
- CSS Modules

**Backend**

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis + BullMQ (job queue + deduplication)
- Socket.io + Redis Adapter
- JWT (httpOnly cookie auth)

**Infrastructure**

- Docker + Docker compose
- AWS EC2
- Nginx (reverse proxy + static file serving)
- GitHub Actions (CI/CD)

## Key Features

- **Live job board scraper** - BullMQ schedules daily scrape jobs per user, fetching listing from the Remotive API and deduplicating via Redis hashes
- **Real-time push** - new job matches appear instantly via Socket.io without a page refresh
- **Kanban board** - drag-and-drop application tracker with optimistic UI that updates across six status columns
- **Job board** - searchable, filterable job listings with a LinkedIn-style split-view detail panel
- **Dashboard** - Recharts analytics showing application status breakdown, weekly activity, stage conversion funnel, and response rate
- **Personalized scrape filters** - users set keywords, job type, salary, and remote preference to control what listings they receive
- **Cookie-based auth** - JWT stored in httpOnly cookies, token denylist in Redis on logout

## Local Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Node.js 20+
- Git

### Steps

1. **Clone the repo**

```bash
    git clone https://github.com/IGrewal08/JobTracker
    cd JobTracker
```

2. **Create the environment file**

```bash
    cp .env.example .env
```

    Fill in the values in `.env`:

```bash
    POSTGRES_USER=jobtracker
    POSTGRES_PASSWORD=yourpassword
    POSTGRES_DB=jobtracker_db
    DATABASE_URL=postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@postgres:5432/<POSTGRES_DB>?schema=public
    JWT_SECRET=generate_with_openssl_rand_hex_32
    HOST=redis
    HOST_URL=http://localhost
```

3. **Build and start all containers**

```bash
    docker compose up --build
```

4. **Run database migrations**

```bash
    # Runs automatically on API container start via prisma migrate deploy
    # To run manually:
    docker compose exec api npx prisma migrate deploy
```

5. **Open the app on http://localhost**

### Development (without Docker)

```bash
# Terminal 1 - API server
cd server && npm install && npm run dev

# Terminal 2 - Scrape worker
cd server && npm run dev:worker

# Terminal 3 - React frontend
cd client && npm install && npm run dev
```

Requires a local PostgresSQL instance and Redis running on port 6379.
Update `DATABASE_URL` in `server/.env` to point to your local Postgres.
