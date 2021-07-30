# Avalon Web Play (WIP)

## Deployment pre-request
Node.js 16+ or Docker

## Development
```bash
npm ci
npm run dev
```

## Deployment - Node.js
```bash
npm ci
npm run build
npm start
```

## Deployment - Docker
```bash
docker build -t avalon .
docker run -d -p 3100:3100 avalon
```