import * as ddb from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';

interface DeleteWeightMutationVariables {
  weightId: string;
}

export function request(ctx: Context<DeleteWeightMutationVariables>) {
  return ddb.remove({
    key: {
      __typename: 'Weight',
      id: ctx.args.weightId,
    },
  });
}

export function response(ctx: Context): boolean {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result ? true : false;
}
