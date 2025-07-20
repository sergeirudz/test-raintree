import * as ddb from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';

interface DeleteUserMutationVariables {
  userId: string;
}

export function request(ctx: Context<DeleteUserMutationVariables>) {
  return ddb.remove({
    key: {
      __typename: 'User',
      id: ctx.args.userId,
    },
  });
}

export function response(ctx: Context): boolean {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result ? true : false;
}
