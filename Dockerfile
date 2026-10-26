# --- deps stage ---
FROM node:24-alpine AS deps
WORKDIR /app
ENV NODE_OPTIONS=--no-network-family-autoselection
RUN corepack enable
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile --network-concurrency 4 --network-timeout 600000

# --- build stage ---
FROM node:24-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS=--no-network-family-autoselection
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# build-time: вшивается в бандл client components
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_TELEMETRY_DISABLED=1

RUN yarn build

# --- runtime stage ---
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
