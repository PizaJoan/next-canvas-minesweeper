FROM node:alpine

RUN apk add --no-cache libc6-compat

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

WORKDIR /frontend

COPY ./.next/standalone ./
COPY ./.next/static .next/static

CMD ["node", "server.js"]