# Development stage
FROM node:24.10.0-alpine3.22 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . ./

# Build stage (for production)
FROM builder AS build
RUN npm run build

# Production stage with nginx
FROM nginxinc/nginx-unprivileged:1.29-alpine3.22-perl AS production

LABEL maintainer=courseproduction@bcit.ca

# Copy built files and nginx config
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080