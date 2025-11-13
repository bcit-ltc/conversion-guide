# Dockerfile

## Build
FROM node:24.10.0-alpine3.22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

RUN npm run build


## Clean
FROM nginx:alpine AS cleaner

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist/ ./
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf


## Release/production
FROM nginxinc/nginx-unprivileged:1.29-alpine3.22-perl AS release

LABEL maintainer=courseproduction@bcit.ca
LABEL org.opencontainers.image.source=https://github.com/bcit-ltc/conversion-guide

WORKDIR /usr/share/nginx/html

COPY conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY favicon.ico /usr/share/nginx/html/
COPY --from=cleaner /usr/share/nginx/html/ ./
