FROM node:16.13.1-alpine3.15

WORKDIR /opt/app

ARG NPM_TOKEN
WORKDIR /opt/app

COPY package.json yarn.lock ./
RUN echo //registry.yarnpkg.com/:_authToken=${NPM_TOKEN} > .npmrc && yarn install --production=false --frozen-lockfile && rm -f .npmrc
COPY . .
