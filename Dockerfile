FROM node:alpine

EXPOSE 3000

WORKDIR /frontend

COPY ./.next/standalone ./
COPY ./.next/static .next/static

CMD ["node", "server.js"]