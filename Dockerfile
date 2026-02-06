# Development
# FROM node:22.14.0-bookworm-slim AS dev
# FROM node:22.14.0-alpine3.21 AS dev
FROM node:24.13-alpine3.23 AS dev
WORKDIR /app
ENV NODE_ENV development
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "dev"]
# CMD ["node", "./dist/app.js"]
# CMD ["/usr/local/bin/node", "/app/dist/app.js"]

# Build for production stage
FROM node:24.13-alpine3.23 AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

# Production
FROM node:24.13-alpine3.23 AS prod
WORKDIR /app
ENV NODE_ENV production
COPY --from=build app/node_modules/ node_modules/
COPY --from=build app/package*.json .
COPY --from=build app/dist dist/
COPY --from=build app/.env.vault .
CMD ["npm", "run", "start"]