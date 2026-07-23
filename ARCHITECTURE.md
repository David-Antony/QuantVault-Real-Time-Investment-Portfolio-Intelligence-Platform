# QuantVault Architecture Overview

QuantVault is a Real-Time Investment Portfolio Intelligence Platform built with a modern Full-Stack JavaScript ecosystem.

## Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, custom CSS design system ("Midnight Markets").
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (Primary Data), Redis (Caching & Job Queues).
- **ORM/ODM**: Prisma.
- **Background Jobs**: BullMQ (for real-time price fetching).
- **Real-time Sync**: WebSockets (`ws`).
- **Data Visualization**: Apache ECharts (Sunburst, Line charts).

## Key Design Patterns
- **Immutable Ledger (Event Sourcing)**: All financial transactions are logged sequentially rather than overwriting a single balance float, ensuring high auditability.
- **Circuit Breaker**: Used in external API calls (e.g. Yahoo Finance) to prevent cascading failures.
- **Global Command Palette**: Keyboard-first design allowing power-user navigation across the entire application.

## CI/CD & Testing
- Automated deployment checks via GitHub Actions.
- End-to-end testing with Playwright.
- OpenAPI/Swagger integration for backend documentation.
