interface ValidateWeightInput {
  userId?: string;
  weight: number;
  date?: string;
  id?: string;
}

interface ValidateWeightEvent {
  arguments: {
    input: ValidateWeightInput;
  };
}

export const handler = async (
  event: ValidateWeightEvent
): Promise<ValidateWeightInput> => {
  console.log('Weight validation event:', JSON.stringify(event, null, 2));

  const { weight } = event.arguments.input;

  if (typeof weight !== 'number' || isNaN(weight)) {
    throw new Error('Weight must be a valid number');
  }

  if (weight < 25.0 || weight > 250.0) {
    throw new Error('Weight must be between 25.0 and 250.0 kg');
  }

  return event.arguments.input;
};
