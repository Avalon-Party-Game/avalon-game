FROM node:18-slim AS BUILD_IMAGE

WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
RUN pnpm i

COPY . .
RUN pnpm build
RUN rm -rf node_modules/

FROM node:18-slim

RUN npm install -g pnpm

WORKDIR /app
COPY --from=BUILD_IMAGE /app/client/dist /app/client/dist
COPY --from=BUILD_IMAGE /app/server/dist /app/server/dist
COPY --from=BUILD_IMAGE /app/client/package.json /app/client/package.json
COPY --from=BUILD_IMAGE /app/server/package.json /app/server/package.json
COPY --from=BUILD_IMAGE /app/package.json /app/package.json

EXPOSE 3100

CMD ["npm", "start"]