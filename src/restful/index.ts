import Router from '@koa/router';
import { onHealthCheck } from './health';

// TODO: add your restful api here
const createRestfulRoute = (router: Router) => {
  router.get('/health', onHealthCheck);

  router.post('/your/endpoint', async (ctx) => {
    let body = ctx.request.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createRestfulRoutes = () => {
  const router = new Router();
  createRestfulRoute(router);
  return router.routes();
};
