import * as ddb from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';

interface GetUserQueryVariables {
  userId: string;
}

interface User {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function request(ctx: Context<GetUserQueryVariables>) {
  return ddb.get({
    key: {
      __typename: 'User',
      id: ctx.args.userId,
    },
  });
}

export function response(ctx: Context): User | null {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result as User | null;
}
