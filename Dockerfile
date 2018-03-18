FROM node:9.8-alpine as builder

WORKDIR /app

COPY package.json .

RUN yarn install

COPY src ./src
COPY public ./public

RUN yarn build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html