import * as ddb from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';

interface GetWeightQueryVariables {
  weightId: string;
}

interface Weight {
  id: string;
  userId: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export function request(ctx: Context<GetWeightQueryVariables>) {
  return ddb.get({
    key: {
      id: ctx.args.weightId,
    },
  });
}

export function response(ctx: Context): Weight | null {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result as Weight | null;
}
