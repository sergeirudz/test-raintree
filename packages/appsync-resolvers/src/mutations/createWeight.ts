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
  const { weight } = ctx.args.input;

  if (typeof weight !== 'number' || isNaN(weight)) {
    util.error('Weight must be a valid number', 'ValidationException');
  }

  if (weight < 25.0 || weight > 250.0) {
    util.error(
      'Weight must be between 25.0 and 250.0 kg',
      'ValidationException'
    );
  }

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
