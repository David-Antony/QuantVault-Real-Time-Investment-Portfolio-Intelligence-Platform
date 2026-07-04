# ── Stage 1: Install dependencies ──────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ── Stage 2: Production image ───────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Copy deps and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client inside the image
RUN npx prisma generate

EXPOSE 3002

ENV NODE_ENV=production

CMD ["node", "server.js"]
