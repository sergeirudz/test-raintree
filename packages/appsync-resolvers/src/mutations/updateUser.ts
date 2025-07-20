import * as ddb from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';

interface UpdateUserInput {
  id: string;
  name?: string;
}

interface UpdateUserMutationVariables {
  input: UpdateUserInput;
}

interface User {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function request(ctx: Context<UpdateUserMutationVariables>) {
  const now = util.time.nowISO8601();
  const { id, ...updateData } = ctx.args.input;

  return ddb.update({
    key: {
      __typename: 'User',
      id: id,
    },
    update: {
      ...updateData,
      updatedAt: now,
    },
  });
}

export function response(ctx: Context): User {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result as User;
}
