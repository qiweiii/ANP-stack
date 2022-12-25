import { PrismaClient } from '@prisma/client';

const db = (): PrismaClient => {
  const prisma = new PrismaClient();
  // soft delete middleware
  prisma.$use(async (params, next) => {
    if (params.model == 'User' || params.model === 'Post') {
      if (params.action == 'delete') {
        // Delete queries
        // Change action to an update
        params.action = 'update';
        if (!params.args) {
          params.args = {};
        }
        params.args.data = { deletedAt: new Date() };
      }
      if (params.action == 'deleteMany') {
        // Delete many queries
        params.action = 'updateMany';
        if (!params.args) {
          params.args = {};
        }
        if (params.args.data !== undefined) {
          params.args.data = { deletedAt: new Date() };
        } else {
          params.args.data = { deletedAt: new Date() };
        }
      }
    }
    return next(params);
  });
  return prisma;
};

export default db;
