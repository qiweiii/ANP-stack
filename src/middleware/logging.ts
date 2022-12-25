/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from 'koa';
import { v4 } from 'uuid';
import { parse, Source } from 'graphql';

export default async function loggingMiddleware(
  ctx: Context & { request: { body: { query: string | Source } } },
  next: () => Promise<any>,
): Promise<any> {
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  // For now, only track graphql
  if (ctx.url !== '/graphql') {
    return next();
  }
  if (ctx.method !== 'POST') {
    return next();
  }
  const start = Date.now();
  const tracingId = v4();
  // inject tracing id for this request context.
  // get it from the context when you need it.
  ctx.tracingId = tracingId;
  let success = false;
  try {
    await next();
    success = ctx.status === 200 && JSON.parse(ctx.response.body as string).errors === undefined;
  } catch (error) {
    // output extra information
    ctx.logger.error(tracingId, {
      tracingId,
      error,
    });
  }
  if (!success) {
    ctx.logger.error(tracingId, {
      tracingId,
      input: JSON.stringify(ctx.request.body),
      output: ctx.response.body,
    });
  }
  const status = ctx.status;
  const ms = Date.now() - start;
  const definitions = parse(ctx.request.body.query).definitions;
  definitions
    .filter((x: any) => x.operation !== undefined)
    .flatMap((x: any) => {
      return x.selectionSet.selections.map((y: any) => {
        return { operation: x.operation, ...y };
      });
    })
    .filter((x: any) => !x.name.value.startsWith('__'))
    .map((x: any) => `${x.operation} ${x.name.value}`)
    .map((x: string) => ({
      tracingId,
      success,
      requestInfo: {
        operation: x,
      },
      responseInfo: {
        httpStatus: status,
        cost: ms,
      },
    }))
    .forEach((x) => ctx.logger.info(x.requestInfo.operation, x));
}
