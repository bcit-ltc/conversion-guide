# Dockerfile

## Build

FROM node:20.16.0-alpine3.20 AS builder

WORKDIR /app

COPY . ./

RUN npm run build


## Clean

FROM nginx:alpine AS cleaner

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/assets ./assets
COPY --from=builder /app/css ./css
COPY --from=builder /app/js ./js
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/partials ./partials
COPY --from=builder /app/index.html ./


## Release/production

FROM nginxinc/nginx-unprivileged AS release

LABEL maintainer courseproduction@bcit.ca

WORKDIR /usr/share/nginx/html

COPY --from=cleaner /usr/share/nginx/html/ ./
