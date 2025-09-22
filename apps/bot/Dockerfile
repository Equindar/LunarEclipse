# --- Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package definitions (root + bot)
COPY package.json package-lock.json* tsconfig.base.json ./
COPY apps/bot/package.json ./apps/bot/

# Install only dependencies for bot
RUN npm install --workspace apps/bot --include-workspace-root

# Copy source code (bot + shared features)
COPY apps/bot ./apps/bot
COPY packages ./packages

# Build the API
RUN npm run build --workspace apps/bot

# --- Runtime
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/bot/build ./build
COPY --from=builder /app/apps/bot/package.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/build ./build

CMD ["node", "build/index.js"]
