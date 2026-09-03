# --- Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package definitions (root + api)
COPY package.json package-lock.json* tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/

# Install only dependencies for api
RUN npm install --workspace apps/api --include-workspace-root

# Copy source code (api + shared features)
COPY apps/api ./apps/api
COPY packages ./packages

# Build the API
RUN npm run build --workspace apps/api

# --- Runtime
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/api/build ./build
COPY --from=builder /app/apps/api/package.json ./

RUN npm install --omit=dev

CMD ["node", "build/server.js"]
