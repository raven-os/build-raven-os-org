# Base stage
FROM node:12.13.1 as base

# Use development to install dev dependencies for build
ENV NODE_ENV=development

# Built-time arguments to pass environment variables
ARG VUE_APP_API_PROTOCOL
ARG VUE_APP_API_HOST
ARG VUE_APP_API_PORT

ENV VUE_APP_API_PROTOCOL "$VUE_APP_API_PROTOCOL"
ENV VUE_APP_API_HOST "$VUE_APP_API_HOST"
ENV VUE_APP_API_PORT "$VUE_APP_API_PORT"

WORKDIR /app

# Install front dependencies
COPY package.json .
RUN npm install

# Install front
COPY . .

# Build stage. Dev environment doesn't run this stage
FROM base as build-stage

ENV NODE_ENV=production

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
