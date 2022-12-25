FROM node:16.13.1-alpine3.15 AS deps

ARG NPM_TOKEN
WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN echo //registry.yarnpkg.com/:_authToken=${NPM_TOKEN} > .npmrc && yarn install --frozen-lockfile && rm -f .npmrc

FROM node:16.13.1-alpine3.15 AS builder

ENV NODE_ENV=production
WORKDIR /opt/app
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN yarn generate && yarn build

FROM node:16.13.1-alpine3.15 AS runner

WORKDIR /opt/app
ENV NODE_ENV=production
USER node
COPY --from=builder /opt/app/package.json ./
COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/build ./build
COPY --from=builder /opt/app/prisma ./prisma
ENTRYPOINT ["npm"]
CMD ["run", "start"]
