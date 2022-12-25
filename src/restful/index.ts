import Router from '@koa/router';
import { Context } from 'koa';
import { onHealthCheck } from './health';

// TODO: add your restful api here
const createRestfulRoute = (router: Router) => {
  router.get('/health', async (ctx: Context) => {
    try {
      await onHealthCheck(ctx);
      ctx.status = 200;
      ctx.body = 'Success';
    } catch (e) {
      ctx.logger.error(e);
      ctx.status = 500;
    }
  });

  // router.post('/your/endpoint', async (ctx) => {
  //   let body = ctx.request.body;
  //   if (typeof body === 'string') {
  //     body = JSON.parse(body);
  //   }
  // });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createRestfulRoutes = () => {
  const router = new Router();
  createRestfulRoute(router);
  return router.routes();
};
