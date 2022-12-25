import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { koaMiddleware } from '@as-integrations/koa';
import http, { Server } from 'http';
import { promisify } from 'util';
import Koa from 'koa';
import koaBody from 'koa-bodyparser';
import cors from '@koa/cors';
import logging from '../middleware/logging';
import { getSecret } from '../util/getSecret';
import db from '../db';
import logger from '../logger';
import schema from '../graphql/schema';
import { createRestfulRoutes } from '../restful';

const PORT = parseInt(process.env.PORT || '4000');
const CORS_ORIGINS = process.env.CORS_ORIGINS || '["*"]';

export const setupServer = async (): Promise<() => Promise<void>> => {
  // need to get DB_URL into process.env otherwise db connect will fail
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    if (!process.env.DB_SECRET_NAME) {
      throw new Error('DB_SECRET_NAME not specified');
    }
    const secrets = await getSecret(process.env.DB_SECRET_NAME);
    process.env.DB_URL = secrets.DB_URL;
  }

  const app = new Koa();
  const prisma = db();
  const httpServer = http.createServer(app.callback());

  app.context.prisma = prisma;
  app.context.logger = logger;

  app.use(koaBody({ enableTypes: ['json', 'form', 'text'] }));
  app.use(logging);
  app.use(createRestfulRoutes());
  app.use(
    cors({
      origin: (ctx) => {
        if (!CORS_ORIGINS) {
          throw new Error(`CORS_ORIGINS not specified`);
        }

        const allowedOrigins: string[] = JSON.parse(CORS_ORIGINS);
        const origin = allowedOrigins.find((ao) => ao === '*' || ao === ctx.origin);
        return origin ?? '';
      },
      allowMethods: ['GET', 'HEAD', 'POST', 'OPTIONS'],
      credentials: true,
      allowHeaders: [
        'app',
        'Access-Control-Allow-Headers',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'Accept',
        'Accept-Version',
        'Authorization',
        'Content-Length',
        'Content-MD5',
        'Content-Type',
        'Date',
      ],
    }),
  );
  // Set up Apollo Server
  const apolloServer = new ApolloServer({
    schema: schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginLandingPageLocalDefault()],
  });
  await apolloServer.start();
  app.use(
    koaMiddleware(apolloServer, {
      // TODO: not using the token, later after adding jwt may need this
      context: async ({ ctx }) => ({ token: ctx.headers.token, prisma: ctx.prisma, logger: ctx.logger }),
    }),
  );

  const koaServer = await new Promise<Server>((resolve) => {
    const server: Server = app
      .listen({ port: PORT }, () => resolve(server))
      .on('error', (err) => {
        logger.error(err.stack);
      })
      .on('close', () => {
        logger.info('Disconnecting Prisma');
        prisma.$disconnect();
      });
  });
  logger.info(`🚀 Server ready at:    http://localhost:${PORT}`);
  logger.info(`⭐️ See sample queries: http://pris.ly/e/ts/graphql-nexus#using-the-graphql-api`);

  // shutdown
  process.on('SIGINT', () => {
    logger.info('SIGINT signal received.');
    koaServer.close(() => {
      logger.info('service server closed.');
    });
  });

  return promisify(koaServer.close.bind(koaServer));
};
