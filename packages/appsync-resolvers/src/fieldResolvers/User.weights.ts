import * as ddb from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';

interface Weight {
  id: string;
  userId: string;
  weight: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export function request(ctx: Context) {
  const userId = ctx.source.id;

  return ddb.scan({
    filter: {
      and: [{ __typename: { eq: 'Weight' } }, { userId: { eq: userId } }],
    },
  });
}

export function response(ctx: Context): Weight[] {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result.items as Weight[];
}
