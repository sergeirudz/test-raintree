import * as ddb from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';

interface UpdateWeightInput {
  id: string;
  weight?: number;
  date?: string;
}

interface UpdateWeightMutationVariables {
  input: UpdateWeightInput;
}

interface Weight {
  id: string;
  userId: string;
  weight: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export function request(ctx: Context<UpdateWeightMutationVariables>) {
  const now = util.time.nowISO8601();
  const { id, ...updateData } = ctx.args.input;

  return ddb.update({
    key: {
      __typename: 'Weight',
      id: id,
    },
    update: {
      ...updateData,
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
