import { PrismaClient } from '@prisma/client';
import db from 'src/db';
import logger from 'src/logger';

// GraphQL Context

export interface GQLContext {
  prisma: PrismaClient;
  logger: Console;
  // TODO: add token stuff
  // token: string;
}

export const context: GQLContext = {
  prisma: db(),
  logger: logger,
};

export default context;
