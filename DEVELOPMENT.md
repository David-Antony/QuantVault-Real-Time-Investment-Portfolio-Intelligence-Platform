# QuantVault — Developer Architecture & Management Guide

Welcome to the **QuantVault** developer documentation. This document serves as the architectural reference for developing, maintaining, and scaling the platform.

---

## 1. System Overview & Architecture

QuantVault is built with a decoupled, high-performance architecture:
- **Backend**: Node.js / Express REST API with PostgreSQL and Prisma ORM.
- **Real-Time Data**: WebSocket (`socket.io`) server streaming live market ticker quotes.
- **Background Tasks**: Scheduled cron jobs (`node-cron`) for price alert monitoring and cache invalidation.
- **Frontend**: Obsidian Terminal Design System with vanilla modular JavaScript, CSS custom properties, and client API wrappers (`public/js/api/`).
- **Security**: JWT authentication (access & refresh tokens), bcrypt password hashing, 2FA (speakeasy TOTP), Helmet headers, and express-rate-limit.

```
                  +-----------------------------------+
                  |     Browser Client (Public)       |
                  |  Vanilla JS + Modular API Clients |
                  +-----------------+-----------------+
                                    |
                    HTTP / REST     |   WebSocket (Live Prices)
                                    v
                  +-----------------+-----------------+
                  |       Node.js Express Server      |
                  |       (server/app.js)             |
                  +-----------------+-----------------+
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
          v                         v                         v
  +---------------+       +------------------+       +------------------+
  |  API Routers  |       |  Prisma Client   |       | Price Poller     |
  |  server/routes|       |  (PostgreSQL DB) |       | (Cron / Sockets) |
  +---------------+       +------------------+       +------------------+
```

---

## 2. Directory Layout

```
QuantVault/
├── .agents/                 # AI Pair Programming rules & customizations
├── __tests__/               # Jest unit & integration test suites
│   ├── analytics.test.js    # Math, risk, and portfolio analytics test suite
│   └── e2e/                 # Playwright end-to-end browser specifications
├── prisma/                  # Database definitions and seeders
│   ├── schema.prisma        # Complete PostgreSQL Prisma schema
│   └── seed.js              # Database bootstrap script
├── public/                  # Frontend single-page application and assets
│   ├── css/
│   │   └── styles.css       # Obsidian Terminal design system (variables, components)
│   ├── js/
│   │   ├── api/             # Modular Client API Wrappers
│   │   │   ├── apiClient.js     # Axios instance with auto-refresh interceptors
│   │   │   ├── authApi.js       # Auth, login, signup, and 2FA methods
│   │   │   ├── portfolioApi.js  # Holdings, transactions, and export methods
│   │   │   ├── alertsApi.js     # Price alert CRUD wrappers
│   │   │   ├── watchlistApi.js  # Watchlist operations
│   │   │   └── analyticsApi.js  # Quantitative metrics & PDF export
│   │   ├── modules/
│   │   │   └── avatars.js   # Procedural SVG vector avatar generator engine
│   │   ├── auth.js          # Client-side route guard & authentication state
│   │   ├── command-palette.js # Command palette keyboard navigation (Ctrl+K / Cmd+K)
│   │   ├── data-models.js   # Client-side data store & calculation models
│   │   ├── keyboard.js      # Global keyboard shortcuts
│   │   ├── script.js        # Core dashboard and transaction UI interactions
│   │   └── theme.js         # Dark/light theme persistence engine
│   ├── alerts.html          # Real-time price alerting management
│   ├── index.html           # Main executive portfolio dashboard
│   ├── login.html           # Modern biometric/password authentication page
│   ├── portfolio.html       # Detailed asset breakdown & historical chart
│   ├── profile.html         # User preferences, security, 2FA, avatar customizer
│   ├── reports.html         # Monte Carlo simulation & quantitative risk metrics
│   ├── signup.html          # Account registration page
│   ├── transactions.html    # Ledger management with filtering & CSV/PDF export
│   └── watchlist.html       # Multi-asset ticker watchlist with live quotes
├── server/                  # Backend application services
│   ├── config/              # Database (Prisma), Swagger, and environment configs
│   ├── controllers/         # Business logic layer
│   │   ├── alertController.js
│   │   ├── authController.js
│   │   ├── pdfController.js
│   │   ├── portfolioController.js
│   │   ├── profileController.js
│   │   └── watchlistController.js
│   ├── middleware/          # Express authentication and error middleware
│   │   ├── auth.js          # JWT verification & role validation
│   │   └── errorHandler.js  # Global API error boundary
│   ├── routes/              # Modular Express routing
│   │   ├── api.js           # Master consolidated API router with rate limiting
│   │   ├── admin.js
│   │   ├── alerts.js
│   │   ├── audit.js
│   │   ├── auth.js
│   │   ├── market.js
│   │   ├── portfolio.js
│   │   ├── profile.js
│   │   ├── reports.js
│   │   ├── twoFactor.js
│   │   └── watchlist.js
│   ├── services/            # Background tasks and market price pollers
│   └── utils/               # Reusable utility libraries
│       ├── ApiError.js      # Structured HTTP error class
│       ├── response.js      # Standardized JSON response helpers
│       ├── jwt.js           # Token signing and validation
│       └── mathUtils.js     # Volatility, Sharpe ratio, and SMA algorithms
├── server.js                # Server entry point (starts HTTP server & WebSockets)
├── package.json             # Dependencies and project run scripts
└── DEVELOPMENT.md           # Developer guide & architecture specification
```

---

## 3. Key Development Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launch local development server with auto-restart (`nodemon`) |
| `npm start` | Start production server (`node server.js`) |
| `npm test` | Run all Jest unit & mathematical verification tests |
| `npm run test:coverage` | Run test suite with detailed coverage reports |
| `npm run lint` | Run ESLint syntax & code quality checks |
| `npm run lint:fix` | Automatically fix ESLint formatting and style issues |
| `npm run prisma:studio` | Launch browser UI to inspect and manage PostgreSQL records |
| `npm run prisma:push` | Sync Prisma schema directly to the database |
| `npm run db:seed` | Populate database with sample demonstration assets and transactions |

---

## 4. Frontend Standards & API Usage

All frontend network requests should use the modular client classes located in `public/js/api/`:
- **Do not** write raw `fetch()` or `axios()` calls in inline page scripts.
- **Use** `PortfolioApi`, `AlertsApi`, `WatchlistApi`, `AnalyticsApi`, and `AuthApi`.
- Token refreshing, authorization headers, and redirection on expired sessions are automatically handled by `public/js/api/apiClient.js`.

### Example: Calling the API
```javascript
// Fetch alerts cleanly with auto-token handling
try {
  const result = await AlertsApi.getAlerts();
  if (result.success) {
    renderAlerts(result.data);
  }
} catch (error) {
  showToast(error.response?.data?.message || 'Failed to fetch alerts', 'error');
}
```

---

## 5. Backend Response Standard

All API routes utilize standard formatting:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional feedback"
}
```
When throwing errors inside controllers, always use `ApiError`:
```javascript
const ApiError = require('../utils/ApiError');

if (!asset) {
  throw ApiError.notFound('Asset was not found');
}
```

---

## 6. Git Contribution Workflow

When committing code in QuantVault:
1. Ensure all tests pass: `npm test`.
2. Ensure linting passes: `npm run lint`.
3. Follow the granular commit rule: **commit each modified or created file separately** with clear semantic commit messages to keep a clear, traceable history.
