FROM node:17.3.1 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY public public
COPY src src
RUN REACT_APP_BASE_URL="/api" yarn build

FROM nginx:latest
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
