# 📈 QuantVault - Real-Time Investment Portfolio Intelligence Platform

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Framework-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis)
![ECharts](https://img.shields.io/badge/ECharts-Visualization-E43961?logo=apacheecharts)
![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas-E34F26?logo=html5)

An enterprise-grade, data-driven investment portfolio intelligence platform designed to help investors track assets, analyze performance, and simulate future wealth growth through advanced financial algorithms and real-time insights.

---

## 2. Overview

**QuantVault** is a full-stack, multi-tenant portfolio management system that transforms raw financial data into actionable insights. It enables users to monitor real-time stock prices, calculate professional-grade investment metrics (like XIRR and Beta), and simulate long-term portfolio growth using Monte Carlo algorithms.

Built with **HTML5, Custom Canvas API, and Vanilla JS** for a lightning-fast frontend and a robust **Node.js + Express.js** backend, the platform leverages **PostgreSQL (via Prisma ORM)** for secure data storage. The application architecture embraces enterprise patterns, utilizing an **Event-Sourced Immutable Ledger** for flawless transaction history, **BullMQ and Redis** for asynchronous background job processing, and **Opossum Circuit Breakers** to ensure resilience against third-party API failures.

Using **ECharts**, the platform generates interactive, dynamic dashboards, historical trend analyses, and asset allocation visualizations. It also features a fully integrated **Progressive Web App (PWA)** architecture, allowing it to be installed natively on devices. The UI has been completely overhauled to feature a stunning **premium glassmorphic aesthetic** powered by custom CSS variables and an animated geometric background.

---

## 3. Features

### 📊 Interactive Analytics Dashboard & Premium UI
* **Futuristic Aesthetic:** Responsive, glassmorphic UI optimized for all devices with high-contrast neon highlights and deep shadows.
* **Animated Geometric Canvas:** A dynamic HTML5 Canvas background that renders an infinite honeycomb grid with randomly spawning, glowing neon paths traversing the vertices.
* **Asset Allocation:** Real-time breakdown of portfolio holdings.
* **Performance Tracking:** ECharts-powered interactive line charts tracking portfolio value over time.
* **Real-time Quotes:** Live market data integrated with Yahoo Finance APIs.

### 🧠 Advanced Financial Analytics Engine
* **Extended Internal Rate of Return (XIRR):** Accurate annualized return calculations handling irregular cash flows.
* **Portfolio Beta:** Measures portfolio volatility and systemic risk compared to the broader market.
* **Monte Carlo Simulations:** 10-year probabilistic wealth forecasting running 1,000 algorithmic paths to predict the 10th, 50th, and 90th percentile outcomes.

### ⚡ Resilient & Enterprise Architecture
* **Event-Driven Ledger:** All trades and deposits are immutably recorded in a `LedgerEntry` system, providing a perfect audit trail for all balance recalculations.
* **Circuit Breakers (Opossum):** External API calls (like Yahoo Finance) are wrapped in circuit breakers that instantly failover to cached data during outages, preventing cascading server failures.
* **Background Processing (BullMQ + Redis):** Heavy tasks, such as generating and exporting large CSV transaction reports, are offloaded to background worker queues, ensuring the main API thread remains blazing fast.

### 🤖 AI-Powered Insights
* Integrates Google Gemini AI to analyze your asset distribution, cash drag, and risk concentration, delivering personalized wealth advisory tips. 
* Seamlessly falls back to local heuristic/rule-based advisory engines if AI keys are absent.

---

## 4. Tech Stack

### 🎨 Frontend
* **Core:** HTML5, CSS3 (Glassmorphism & Variables), Vanilla JavaScript
* **Graphics:** HTML5 Canvas API (Custom geometric animations)
* **Visualization:** Apache ECharts
* **Features:** Progressive Web App (Service Workers, Web Manifest)

### ⚙️ Backend
* **Runtime:** Node.js & Express.js
* **Database & ORM:** PostgreSQL & Prisma
* **Caching & Queues:** Redis, BullMQ, ioredis
* **Resilience:** Opossum (Circuit Breakers)
* **Security:** JWT Authentication, Bcrypt password hashing

---

## 5. Installation & Running the Project

### Prerequisites
*   [Node.js](https://nodejs.org/) (v20+ recommended)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Required for running PostgreSQL and Redis containers)

### Setup Steps

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/David-Antony/QuantVault-Real-Time-Investment-Portfolio-Intelligence-Platform.git
    cd QuantVault-Real-Time-Investment-Portfolio-Intelligence-Platform
    ```

2.  **Environment Variables:**
    Ensure you have a `.env` file in the root directory configured with your secrets:
    ```env
    DATABASE_URL="postgresql://portfolio_user:pass1@localhost:5432/portfolio_management"
    REDIS_URL="redis://localhost:6379"
    JWT_ACCESS_SECRET="your_access_secret"
    JWT_REFRESH_SECRET="your_refresh_secret"
    CLIENT_URL="http://localhost:3002"
    GEMINI_API_KEY="your_optional_gemini_key"
    ```

---

### Option A: Fully Dockerized Start (Production-Like) 🚀

This method spins up the Database, Redis, and the Node.js application in isolated containers.

1.  **Launch via Docker Compose:**
    ```bash
    docker-compose up -d --build
    ```
2.  **Access the App:**
    Open [http://localhost:3002](http://localhost:3002) in your browser.

---

### Option B: Local Development (Separate DB/Redis) 💻

If you prefer to run the Node server directly in your terminal for hot-reloading:

#### 1. Start the Infrastructure (Postgres + Redis)
Spin up just the background database services:
```bash
docker-compose up -d db redis
```

#### 2. Install Dependencies & Setup DB
```bash
npm install
npx prisma generate
npx prisma db push
```

#### 3. Start the Backend Server
Run the development server (runs on Port `3002`):
```bash
npm run dev
```
Open [http://localhost:3002](http://localhost:3002) in your browser.

---

## 6. Screenshots

| Login & Authentication | Portfolio Dashboard |
| --- | --- |
| ![Login Page](https://placehold.co/600x400/0f172a/00eeff?text=Authentication+Portal) | ![Dashboard](https://placehold.co/600x400/0f172a/00eeff?text=Interactive+Dashboard) |

| Advanced Analytics & Forecasting | Transactions & Ledger |
| --- | --- |
| ![Monte Carlo](https://placehold.co/600x400/0f172a/00eeff?text=Monte+Carlo+Forecasts) | ![Ledger](https://placehold.co/600x400/0f172a/00eeff?text=Immutable+Transaction+Ledger) |

---

## 7. Live Demo

The project is ready for deployment on platforms like Vercel, Render, or AWS.  
👉 **[Live Demo URL](https://github.com/David-Antony/QuantVault-Real-Time-Investment-Portfolio-Intelligence-Platform)** (Will be ready once deployed..)

---

## 8. Future Improvements

*   **Plaid / Broker Integration:** Sync live transactions automatically from brokerages via secure APIs instead of manual CSV imports.
*   **Custom Goal Tracking:** Enable users to set target net-worth milestones and receive gamified updates as they approach them.
*   **Email & SMS Alerts:** Connect the background Job Queue (BullMQ) to Twilio or SendGrid to dispatch triggered price alerts instantly.
*   **Advanced Tax-Loss Harvesting:** Algorithms to suggest which underperforming assets to sell to offset capital gains tax.


---

## 9. Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request
