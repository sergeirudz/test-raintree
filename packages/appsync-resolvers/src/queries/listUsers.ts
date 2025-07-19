import * as ddb from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';

interface ListUsersQueryVariables {
  limit?: number;
  nextToken?: string;
}

interface User {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface UserConnection {
  items: User[];
  nextToken?: string;
}

export function request(ctx: Context<ListUsersQueryVariables>) {
  const { limit = 20, nextToken } = ctx.args;

  return ddb.scan({
    filter: {
      __typename: { eq: 'User' },
    },
    limit,
    nextToken,
  });
}

export function response(ctx: Context): UserConnection {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return {
    items: ctx.result.items as User[],
    nextToken: ctx.result.nextToken,
  };
}
