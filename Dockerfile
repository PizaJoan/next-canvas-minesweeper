FROM node:alpine

COPY .next/standalone /frontend/
COPY .next/static /frontend/.next/static

EXPOSE 3000

WORKDIR /frontend

CMD ["node", "server.js"]