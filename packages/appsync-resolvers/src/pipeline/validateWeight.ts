import { util, Context } from '@aws-appsync/utils';

export function request(ctx: Context) {
  return {
    operation: 'Invoke',
    payload: {
      field: ctx.info.fieldName,
      arguments: ctx.arguments,
    },
  };
}

export function response(ctx: Context) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result;
}
