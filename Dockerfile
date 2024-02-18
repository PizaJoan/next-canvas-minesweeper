FROM node:alpine

COPY .next/standalone /frontend/

EXPOSE 3000

WORKDIR /frontend

CMD ["node", "server.js"]