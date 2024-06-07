# BUILD
FROM node:20-alpine AS build

WORKDIR /home/node/app

COPY package.json ./
COPY prisma ./prisma

RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build \
    && npm prune --production

# RUN
FROM node:20-alpine

WORKDIR /home/node/app

COPY package.json ./
COPY --from=build /home/node/app/prisma ./prisma
COPY --from=build /home/node/app/dist ./dist
COPY --from=build /home/node/app/node_modules ./node_modules

EXPOSE 8080

ENV DATABASE_URL file:./db/dev.db

CMD /bin/sh -c "npm run generate && npm run migrate && node dist/index-docker.js"
