# stage 1
FROM node:20 as builder
WORKDIR /nestjs
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run db:generate
RUN npm run build
RUN npm prune --omit=dev

# # stage 2
FROM node:20-slim
RUN apt-get update -y
RUN apt-get install -y openssl
WORKDIR /nestjs

COPY --from=builder /nestjs/node_modules /nestjs/node_modules
COPY --from=builder /nestjs/dist /nestjs/dist
CMD node dist/main.js