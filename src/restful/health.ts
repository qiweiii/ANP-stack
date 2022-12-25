import { Context } from 'koa';

export const onHealthCheck = async (ctx: Context): Promise<boolean> => {
  const result = await ctx.prisma.$queryRaw<string[]>`
  select
    tablename as table
  from
    pg_tables
  where schemaname = 'public'`;
  if (result && result.length > 0) {
    return true;
  }
  return false;
};
