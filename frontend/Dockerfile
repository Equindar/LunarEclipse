# --- Setup base image
FROM node:20.15.0-alpine AS base


# --- Setup dependencies image from origin 'base'
FROM base AS dependencies
RUN apk add --no-cache libc6-compat
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
COPY --from=dependencies /node_modules ./node_modules
COPY . .
RUN npm run build


# --- Setup production image from origin 'base'
FROM base AS production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=development /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=development --chown=nextjs:nodejs /app/build/ ./
COPY --from=development --chown=nextjs:nodejs /app/build/static ./static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# command to run within the container
# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]