FROM node:17.3.1 as build-deps
WORKDIR /usr/src/api
COPY . .
RUN npm i
CMD NODE_ENV="production" npm run start