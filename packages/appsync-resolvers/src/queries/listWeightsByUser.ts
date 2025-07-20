import * as ddb from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';

interface ListWeightsByUserQueryVariables {
  userId: string;
  limit?: number;
  nextToken?: string;
}

interface Weight {
  id: string;
  userId: string;
  weight: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface WeightConnection {
  items: Weight[];
  nextToken?: string;
}

export function request(ctx: Context<ListWeightsByUserQueryVariables>) {
  const { userId, limit = 20, nextToken } = ctx.args;

  return ddb.scan({
    filter: {
      and: [{ __typename: { eq: 'Weight' } }, { userId: { eq: userId } }],
    },
    limit,
    nextToken,
  });
}

export function response(ctx: Context): WeightConnection {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return {
    items: ctx.result.items as Weight[],
    nextToken: ctx.result.nextToken,
  };
}
