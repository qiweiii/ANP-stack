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
π¦ Sample App
 β£ π .github                     # Pipeline definition code.
 β β£ π .github/workflows/cd.yml  # GitHub action workflow.
 β β£ π .github/deploy.yml        # Deliverybot configuration file.
 β£ π infra                       # docker files and helm charts that manage our infrastructure.
 β β£ π config                    # Contains value files per environment.
 β£ π prisma                      # Prisma schema.
 β£ π scripts                     # Some bash scripts need be to executed through pipelineγ
 β£ π src
 β β£ π common                    # Common stuff like constants, helpers functionsγ
 β β£ π graqhpl                   # Graphql schema, types, resolversγ
 β β£ π middleware                # Koa middlewares.
 β β£ π restful                   # Restful Koa route.
 β β£ π setupServer               # Setup koa + apollo server.
 β β£ π types                     # TypeScript type definitions.
 β β£ π utils
 β β£ π app                       # service entrypoint.
 β β£ π db                        # The PrismaClient after applying prisma middlewares.
 β β π logger                    # Logger for recording information/debug.
 β£ π tests                       # Jest tests.
 β π package.json
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