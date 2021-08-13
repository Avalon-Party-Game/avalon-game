FROM node:16-alpine AS BUILD_IMAGE

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm ci

COPY . .
RUN npm run build
RUN rm -rf node_modules/

FROM node:16-alpine

WORKDIR /app
COPY --from=BUILD_IMAGE /app/client/dist /app/client/dist
COPY --from=BUILD_IMAGE /app/server/dist /app/server/dist
COPY --from=BUILD_IMAGE /app/client/package.json /app/client/package.json
COPY --from=BUILD_IMAGE /app/server/package.json /app/server/package.json
COPY --from=BUILD_IMAGE /app/package.json /app/package.json

EXPOSE 3100

CMD ["npm", "start:docker"]