FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm ci

COPY . .
RUN npm run build
RUN rm -rf node_moduels/
EXPOSE 3100

CMD ["npm", "start"]