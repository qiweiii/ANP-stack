## Intro

A template for boostrapping a backend service(GraphQL & Restful) using *Apollo Server + Nexus + Prisma* stack, with various other useful tools like devops, testing, etc.

## Stack

- **Apollo Server v4 (with *Koa* integration)**: Run GraphQL & Http server
- **Nexus**: Writing code-first GraphQL schema
- **Prisma v4**: ORM
- **Postgres**: Relational Database
- **jest**: Unit tests
- **Github Action**: CI
- **Helm**: CD

## Getting Started

```
📦 Sample App
 ┣ 📂 .github                     # Pipeline definition code.
 ┃ ┣ 📂 .github/workflows/cd.yml  # GitHub action workflow.
 ┃ ┣ 📂 .github/deploy.yml        # Deliverybot configuration file.
 ┣ 📂 infra                       # docker files and helm charts that manage our infrastructure.
 ┃ ┣ 📂 config                    # Contains value files per environment.
 ┣ 📂 prisma                      # Prisma schema.
 ┣ 📂 scripts                     # Some bash scripts need be to executed through pipeline。
 ┣ 📂 src
 ┃ ┣ 📂 common                    # Common stuff like constants, helpers functions。
 ┃ ┣ 📂 graqhpl                   # Graphql schema, types, resolvers。
 ┃ ┣ 📂 middleware                # Koa middlewares.
 ┃ ┣ 📂 restful                   # Restful Koa route.
 ┃ ┣ 📂 setupServer               # Setup koa + apollo server.
 ┃ ┣ 📂 types                     # TypeScript type definitions.
 ┃ ┣ 📂 utils
 ┃ ┣ 📂 app                       # service entrypoint.
 ┃ ┣ 📂 db                        # The PrismaClient after applying prisma middlewares.
 ┃ ┗ 📂 logger                    # Logger for recording information/debug.
 ┣ 📂 tests                       # Jest tests.
 ┗ 📜 package.json
```

- Start postgres database
  - Create a new db named `anp-sample`
  - OR you could run db via docker-compose
    - `docker-compose -f infra/docker-compose/dev.yml up -d`
- `cp sample.env .env`, copy the `sample.env` into `.env` file
- `yarn`, install dependencies
- `yarn db:new-migration init`, migrate db & seed data (only the first time)
- `yarn dev`, run service, go to http://localhost:4000/graphql
- `yarn studio`, this is optional, then go to http://localhost:5555 and explore data.
- `yarn test`, run all `jest` unit test.
- Explore `package.json -> scripts` for more commands.

## Deploy to environments

<!-- TODO -->

## References
- [The Problems of "Schema-First" GraphQL Server Development](https://www.prisma.io/blog/the-problems-of-schema-first-graphql-development-x1mn4cb0tyl3)
- [Introducing GraphQL Nexus: Code-First GraphQL Server Development](https://www.prisma.io/blog/introducing-graphql-nexus-code-first-graphql-server-development-ll6s1yy5cxl5)
- [Prisma example: graphql-nexus](https://github.com/prisma/prisma-examples/blob/latest/typescript/graphql-nexus)
- [Similar tempalte: prisma-nexus-apollo-boilerplate](https://github.com/prisma-korea/prisma-nexus-apollo-boilerplate)
- [Helm Action](https://github.com/deliverybot/example-helm)

## Helpful debug issues

- [ambiguous NEXUS__UNKNOWN__TYPE error](https://github.com/graphql-nexus/nexus/issues/1119)
- [(DB Migration) Moving backwards and reverting all changes](https://www.prisma.io/docs/guides/database/production-troubleshooting#moving-backwards-and-reverting-all-changes)