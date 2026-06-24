# Portfolio Management System

A production-grade full-stack portfolio tracking application with JWT authentication, PostgreSQL persistence, and user-specific data isolation.

## Architecture

```
Client (Browser)
  ├── HTML5 / CSS3 (Glassmorphism Theme)
  ├── Chart.js (Portfolio Visualization)
  ├── Axios HTTP Client
  │     ├── JWT Access Token (Authorization Header)
  │     └── Automatic Refresh Token Rotation
  └── Custom SVG Avatar Generator (12 Presets)

Express.js Server (Port 3002)
  ├── Helmet (Security Headers)
  ├── CORS (Cookie Credentials)
  ├── Rate Limiting (Auth: 20/15min, API: 200/15min)
  ├── Input Validation (express-validator)
  ├── JWT Middleware (access + refresh token)
  ├── Global Error Handler
  └── Static File Server (public/)

PostgreSQL Database
  └── Prisma ORM
        ├── users
        ├── portfolios
        ├── assets
        └── transactions
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript, Chart.js, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | bcrypt (12 rounds), JWT (access + refresh tokens), httpOnly cookies |
| **Security** | Helmet, CORS, Rate Limiting, Input Validation |
| **Dev Tools** | ESLint, Prettier, Nodemon, Jest, Supertest |

## Database Schema

### Users
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, Auto Increment |
| username | VARCHAR(100) | UNIQUE, NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL (bcrypt) |
| avatar_preset | VARCHAR(50) | DEFAULT 'default' |
| avatar_config | JSONB | DEFAULT '{}' |
| refresh_token | TEXT | NULLABLE (hashed) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| last_login | TIMESTAMPTZ | NULLABLE |

### Portfolios
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, Auto Increment |
| user_id | INT | UNIQUE FK → users(id) CASCADE |
| name | VARCHAR(200) | DEFAULT 'My Portfolio' |
| cash_balance | DECIMAL(15,2) | DEFAULT 100000.00 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | Auto Update |

### Assets
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, Auto Increment |
| portfolio_id | INT | FK → portfolios(id) CASCADE |
| name | VARCHAR(100) | NOT NULL |
| type | VARCHAR(50) | NOT NULL |
| current_price | DECIMAL(15,2) | NOT NULL |
| quantity | DECIMAL(15,6) | NOT NULL |
| average_cost | DECIMAL(15,2) | NOT NULL |
| total_invested | DECIMAL(15,2) | NOT NULL |

### Transactions
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PK, Auto Increment |
| portfolio_id | INT | FK → portfolios(id) CASCADE |
| asset_name | VARCHAR(100) | NOT NULL |
| type | VARCHAR(20) | buy/sell/dividend/interest |
| amount | DECIMAL(15,2) | NOT NULL |
| price | DECIMAL(15,2) | NULLABLE |
| quantity | DECIMAL(15,6) | NULLABLE |
| status | VARCHAR(20) | DEFAULT 'completed' |
| date | DATE | NOT NULL |

## API Endpoints

### Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Server health check |

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user (creates portfolio with 100,000 cash) |
| POST | `/api/auth/login` | No | Login, returns access + refresh tokens |
| POST | `/api/auth/refresh` | Cookie | Rotate refresh token, issue new access token |
| POST | `/api/auth/logout` | Bearer | Clear refresh token, remove cookie |

### Portfolio
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/portfolio` | Bearer | Get user portfolio with assets, transactions, metrics |
| GET | `/api/portfolio/transactions` | Bearer | Get all transactions |
| POST | `/api/portfolio/transactions` | Bearer | Create transaction (updates cash balance + assets) |
| DELETE | `/api/portfolio/transactions/:id` | Bearer | Delete a transaction |
| GET | `/api/portfolio/export` | Bearer | Export portfolio as JSON |
| DELETE | `/api/portfolio/clear` | Bearer | Delete all transactions/assets, reset cash |

### Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile` | Bearer | Get user profile |
| PUT | `/api/profile` | Bearer | Update username, avatar preset/config |
| PUT | `/api/profile/password` | Bearer | Change password (requires current password) |

## Security Features

- **bcrypt** password hashing with 12 salt rounds
- **JWT access tokens** (15 min expiry) stored in memory/localStorage
- **JWT refresh tokens** (7 day expiry) stored in httpOnly secure cookies with rotation
- **Helmet** security headers (CSP relaxed for inline scripts)
- **CORS** with credentials enabled, restricted origin
- **Rate limiting** on auth routes (20 req/15min) and API routes (200 req/15min)
- **Input validation** on all routes with express-validator
- **User-specific data isolation**: every portfolio query scoped to authenticated userId
- **Refresh token hashing** stored in database, compared with bcrypt on rotation

## Project Structure

```
├── server.js                    # Entry point
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore                   # Ignored files
├── README.md                    # This file
├── prisma/
│   └── schema.prisma            # Database schema
├── server/
│   ├── app.js                   # Express application setup
│   ├── config/
│   │   └── db.js                # Prisma client singleton
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── validate.js          # Input validation wrapper
│   │   └── errorHandler.js      # Global error handler
│   ├── controllers/
│   │   ├── authController.js    # Register, login, refresh, logout
│   │   ├── portfolioController.js # CRUD + export + clear
│   │   └── profileController.js # Get, update, change password
│   ├── routes/
│   │   ├── auth.js              # Auth route definitions
│   │   ├── portfolio.js         # Portfolio route definitions
│   │   └── profile.js           # Profile route definitions
│   └── utils/
│       ├── jwt.js               # Token generation & verification
│       └── ApiError.js          # Custom error class
├── public/
│   ├── index.html               # Landing page
│   ├── login.html               # Login page
│   ├── signup.html              # Registration page
│   ├── portfolio.html           # Portfolio overview
│   ├── transactions.html        # Transaction management
│   ├── reports.html             # Reports & charts
│   ├── profile.html             # User profile & avatar
│   ├── css/
│   │   └── styles.css           # Glassmorphism theme
│   └── js/
│       ├── api/
│       │   ├── apiClient.js     # Axios instance with JWT interceptors
│       │   ├── authApi.js       # Auth API calls
│       │   └── portfolioApi.js  # Portfolio API calls
│       ├── auth.js              # Auth manager & page guard
│       ├── data-models.js       # Data models & portfolio store
│       └── script.js            # UI logic, charts, notifications
└── tests/                       # Test files (Jest + Supertest)
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone and Install
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

Required `.env` variables:
```
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_management"
JWT_ACCESS_SECRET="your-secure-random-string"
JWT_REFRESH_SECRET="your-another-secure-random-string"
```

### 3. Create PostgreSQL Database
```bash
# In psql or pgAdmin:
CREATE DATABASE portfolio_management;
```

### 4. Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

### 6. Start Development Server
```bash
npm run dev
```

Server starts at `http://localhost:3002`

### Production Build
```bash
npm start
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon for development |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm test` | Run Jest tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |

## Key Design Decisions

1. **Refresh token rotation**: Each refresh issues a new refresh token and invalidates the old one, preventing token theft
2. **httpOnly cookies for refresh tokens**: JavaScript cannot access refresh tokens, preventing XSS token theft
3. **Axios interceptor queue pattern**: Multiple simultaneous 401 responses trigger only one refresh call, then all queued requests retry with the new token
4. **Portfolio auto-creation**: Portfolio with 100,000 starting cash is created automatically on registration and on first portfolio access if missing
5. **Decimal precision**: All monetary values stored as PostgreSQL DECIMAL to avoid floating-point rounding errors
6. **Cascade deletes**: Deleting a user cascades through portfolio → assets + transactions
