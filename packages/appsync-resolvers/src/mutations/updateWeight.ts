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
  const { weight } = ctx.args.input;

  if (weight !== undefined) {
    if (typeof weight !== 'number' || isNaN(weight)) {
      util.error('Weight must be a valid number', 'ValidationException');
    }

    if (weight < 25.0 || weight > 250.0) {
      util.error(
        'Weight must be between 25.0 and 250.0 kg',
        'ValidationException'
      );
    }
  }

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
