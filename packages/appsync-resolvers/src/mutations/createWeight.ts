import * as ddb from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';

interface CreateWeightInput {
  userId: string;
  weight: number;
  date: string;
}

interface CreateWeightMutationVariables {
  input: CreateWeightInput;
}

interface Weight {
  id: string;
  userId: string;
  weight: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export function request(ctx: Context<CreateWeightMutationVariables>) {
  const now = util.time.nowISO8601();
  const id = util.autoId();

  return ddb.put({
    key: {
      __typename: 'Weight',
      id: id,
    },
    item: {
      id: id,
      __typename: 'Weight',
      ...ctx.args.input,
      createdAt: now,
      updatedAt: now,
    },
  });
}

export function response(ctx: Context): Weight {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result as Weight;
}
