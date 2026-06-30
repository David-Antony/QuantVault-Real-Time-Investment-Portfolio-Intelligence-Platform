# QuantVault — Real-Time Investment Portfolio Intelligence Platform

A production-grade full-stack investment portfolio platform with **WebSocket real-time price feeds**, JWT authentication, smart price alert engine, advanced financial analytics, audit logging, PostgreSQL persistence, and Docker support.

## Architecture

```
Client (Browser)
  ├── HTML5 / CSS3 (Glassmorphism Theme)
  ├── Chart.js (Real Portfolio History Visualization)
  ├── Socket.io Client (Live Price Updates)
  ├── Axios HTTP Client
  │     ├── JWT Access Token (Authorization Header)
  │     └── Automatic Refresh Token Rotation
  └── Custom SVG Avatar Generator (12 Presets)

Express.js + Socket.io Server (Port 3002)
  ├── Helmet (Security Headers)
  ├── CORS (Cookie Credentials)
  ├── Rate Limiting (Auth: 20/15min, API: 200/15min)
  ├── Input Validation (express-validator)
  ├── JWT Middleware (access + refresh token)
  ├── Audit Log Middleware
  ├── Global Error Handler
  └── Static File Server (public/)

Background Services
  ├── Price Service (Brownian Motion mock engine, 8s tick)
  ├── Socket.io Broadcaster (per-user private rooms)
  └── Snapshot Cron (daily portfolio value snapshots @ 00:01)

PostgreSQL Database
  └── Prisma ORM
        ├── users
        ├── portfolios
        ├── assets
        ├── transactions
        ├── audit_logs       ← NEW
        ├── portfolio_snapshots ← NEW
        └── price_alerts     ← NEW
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3 (Glassmorphism), Vanilla JS, Chart.js, Axios, Socket.io Client |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | bcrypt (12 rounds), JWT (access + refresh tokens), httpOnly cookies |
| **Real-Time** | Socket.io WebSocket, Mock Brownian Motion Price Engine |
| **Background Jobs** | node-cron (daily snapshots) |
| **Security** | Helmet, CORS, Rate Limiting, Input Validation, Audit Logging |
| **Export** | CSV (Excel-compatible with BOM), JSON |
| **DevOps** | Docker, Docker Compose, Adminer |
| **Dev Tools** | ESLint, Prettier, Nodemon, Jest, Supertest |

## Key Features

### 🔴 Core Intelligence
- **Real-time price feeds** via Socket.io — portfolio value updates every 8 seconds
- **Smart price alert engine** — set above/below triggers per asset, get notified when triggered
- **Portfolio snapshot history** — daily cron job records real portfolio value for genuine chart data

### 🟡 Advanced Analytics
- **Sharpe Ratio** — risk-adjusted return vs 6% annual risk-free baseline
- **Volatility (σ)** — standard deviation of monthly returns
- **Max Drawdown** — largest peak-to-trough portfolio decline
- **Win Rate** — percentage of assets with positive return
- **Diversification Score** — Shannon entropy-based spread metric
- **Passive Income Tracker** — cumulative dividends + interest received
- **Transaction Breakdown** — buy/sell/dividend/interest counts

### 🟠 Enterprise Quality
- **Audit Log** — every login, logout, buy, sell, delete recorded with IP + timestamp
- **JWT refresh token rotation** — each refresh issues a new token, invalidating the old
- **CSV export** — Excel-compatible with BOM encoding
- **Docker + Docker Compose** — one-command startup with PostgreSQL + Adminer

## API Endpoints

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health + version |

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register + auto-create portfolio |
| POST | `/api/auth/login` | No | Login → access + refresh tokens |
| POST | `/api/auth/refresh` | Cookie | Rotate refresh token |
| POST | `/api/auth/logout` | Bearer | Clear refresh token |

### Portfolio
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/portfolio` | Bearer | Full portfolio with metrics |
| GET | `/api/portfolio/analytics` | Bearer | Sharpe, volatility, drawdown, win rate |
| GET | `/api/portfolio/history?days=30` | Bearer | Real snapshot history for chart |
| GET | `/api/portfolio/transactions` | Bearer | All transactions |
| POST | `/api/portfolio/transactions` | Bearer | Create transaction |
| DELETE | `/api/portfolio/transactions/:id` | Bearer | Delete transaction |
| GET | `/api/portfolio/export` | Bearer | Export JSON |
| GET | `/api/portfolio/export/csv` | Bearer | Export CSV (Excel-ready) |
| DELETE | `/api/portfolio/clear` | Bearer | Reset portfolio |

### Price Alerts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/alerts` | Bearer | List all alerts |
| POST | `/api/alerts` | Bearer | Create alert (above/below) |
| PATCH | `/api/alerts/:id/toggle` | Bearer | Pause / resume |
| DELETE | `/api/alerts/:id` | Bearer | Delete alert |

### Audit Log
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/audit` | Bearer | Last 50 activity entries |

### Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile` | Bearer | Get user profile |
| PUT | `/api/profile` | Bearer | Update username + avatar |
| PUT | `/api/profile/password` | Bearer | Change password |

## Setup Instructions

### Prerequisites
- Node.js 20+
- PostgreSQL 14+

### 1. Install
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Required `.env` variables:
```
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_management"
JWT_ACCESS_SECRET="your-secure-random-string"
JWT_REFRESH_SECRET="your-another-secure-random-string"
CLIENT_URL="http://localhost:3002"
```

### 3. Create PostgreSQL Database
```sql
CREATE DATABASE portfolio_management;
```

### 4. Run Migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start Development Server
```bash
npm run dev
```

Open **http://localhost:3002**

### 6. Run with Docker (One Command)
```bash
docker-compose up --build
```
- App: http://localhost:3002
- DB Admin (Adminer): http://localhost:8080

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon (development) |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm test` | Run Jest tests |
| `npm run lint` | Run ESLint |

## Project Structure

```
├── server.js                    # Entry point (HTTP + Socket.io)
├── Dockerfile                   # Multi-stage production Docker build
├── docker-compose.yml           # App + PostgreSQL + Adminer
├── .dockerignore
├── package.json
├── .env / .env.example
├── prisma/
│   └── schema.prisma            # DB schema (6 models)
├── server/
│   ├── app.js                   # Express app setup + routes
│   ├── config/db.js             # Prisma singleton
│   ├── middleware/
│   │   ├── auth.js              # JWT middleware
│   │   ├── validate.js          # Input validation wrapper
│   │   └── errorHandler.js     # Global error handler
│   ├── controllers/
│   │   ├── authController.js    # Register, login, refresh, logout
│   │   ├── portfolioController.js # CRUD + export + analytics + history
│   │   ├── analyticsController.js # Sharpe, volatility, drawdown, win rate
│   │   ├── alertController.js   # Price alert CRUD
│   │   ├── auditController.js   # Activity log
│   │   └── profileController.js
│   ├── routes/
│   │   ├── auth.js, portfolio.js, profile.js
│   │   ├── alerts.js            # NEW
│   │   └── audit.js             # NEW
│   ├── services/
│   │   ├── priceService.js      # Brownian motion price engine + broadcaster
│   │   └── snapshotService.js   # Daily cron snapshot
│   └── utils/
│       ├── jwt.js
│       ├── auditLogger.js       # NEW
│       └── ApiError.js
├── public/
│   ├── index.html               # Landing (QuantVault branding)
│   ├── login.html / signup.html
│   ├── portfolio.html           # Live price updates via Socket.io
│   ├── transactions.html        # Add/view/delete + CSV export
│   ├── reports.html             # Advanced analytics + real chart
│   ├── alerts.html              # NEW — price alert management
│   └── profile.html            # Avatar + activity audit log
└── tests/                       # Jest + Supertest
```

## Security Architecture

- **bcrypt** password hashing (12 salt rounds)
- **JWT access tokens** (15 min) in memory/localStorage
- **JWT refresh tokens** (7 day) in httpOnly secure cookies with rotation
- **Refresh token hashing** in DB — compared with bcrypt on each rotation
- **Helmet** security headers
- **CORS** with credentials, restricted origin
- **Rate limiting** — auth (20/15min), API (200/15min)
- **Input validation** on all mutating routes
- **Audit logging** — every login, logout, transaction recorded with IP
- **User-scoped data** — every query scoped to authenticated userId
