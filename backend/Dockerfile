# --- Setup base image
FROM node:20.15.0-alpine AS base


# --- Setup dependencies image from origin 'base'
FROM base AS dependencies
# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi


# --- Setup development image from origin 'base'
FROM base AS development
WORKDIR /app
COPY . .
RUN npm ci && npm run build


# --- Setup production image from origin 'base'
FROM base AS production
# container exposed network port number
WORKDIR /app
EXPOSE 3001

COPY --from=development /app/build ./build
COPY package.json package-lock.json ./
RUN npm install --omit=dev
# command to run within the container
CMD [ "node", "build/server.js" ]