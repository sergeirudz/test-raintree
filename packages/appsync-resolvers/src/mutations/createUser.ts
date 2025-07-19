import * as ddb from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';

interface CreateUserInput {
  name: string;
}

interface CreateUserMutationVariables {
  input: CreateUserInput;
}

interface User {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function request(ctx: Context<CreateUserMutationVariables>) {
  const now = util.time.nowISO8601();
  const id = util.autoId();

  return ddb.put({
    key: {
      id: id,
    },
    item: {
      id: id,
      __typename: 'User',
      ...ctx.args.input,
      createdAt: now,
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
