FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm ci

COPY . .
RUN npm run build
EXPOSE 3100

CMD ["npm", "start"]