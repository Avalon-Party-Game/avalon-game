FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm ci

COPY . .
RUN npm run build
RUN rm -rf node_modules/
EXPOSE 3100

CMD ["npm", "start"]