# stage 1
FROM node:18 as builder
WORKDIR /nestjs
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

# # stage 2
FROM node:18-slim
RUN apt-get update -y
RUN apt-get install -y openssl
ENV NODE_ENV production
WORKDIR /nestjs

COPY --from=builder /nestjs/node_modules /nestjs/node_modules
COPY --from=builder /nestjs/dist /nestjs/dist
CMD node dist/main.js