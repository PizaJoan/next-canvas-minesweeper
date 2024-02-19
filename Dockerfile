FROM node:alpine as builder

# Add container deppendencies
RUN apk add --no-cache libc6-compat
RUN corepack enable
RUN corepack install -g pnpm@8.15.3

WORKDIR /frontend

# Build app
COPY . .

RUN pnpm install
RUN pnpm run build

FROM node:alpine as service

EXPOSE 3000

WORKDIR /frontend

# Copy app from builder
COPY --from=builder /frontend/.next/standalone ./
COPY --from=builder /frontend/.next/static .next/static

CMD ["node", "server.js"]