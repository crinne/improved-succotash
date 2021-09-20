FROM node:alpine AS builder

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build


FROM node:alpine

WORKDIR /app

COPY --from=builder ./app/build ./
COPY package-lock.json .
COPY package.json .

RUN npm --production install

EXPOSE 3000
CMD ["node", "./src/index.js"]
