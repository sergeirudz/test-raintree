import { useForm } from '@tanstack/react-form';
import type { AnyFieldApi } from '@tanstack/react-form';
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  InputAdornment,
  Stack,
} from '@mui/material';
import { useCreateWeightMutation } from './lib/api';
import type { Weight } from '@repo/graphql/codegen/API';

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <Typography variant="caption" color="error" display="block">
          {field.state.meta.errors.join(', ')}
        </Typography>
      ) : null}
      {field.state.meta.isValidating ? (
        <Typography variant="caption" color="info" display="block">
          Validating...
        </Typography>
      ) : null}
    </>
  );
}

interface AddWeightFormProps {
  userId: string;
  onSuccess?: (weight: Weight) => void;
  onError?: (error: Error) => void;
}

const AddWeightForm = ({ userId, onSuccess, onError }: AddWeightFormProps) => {
  const createWeightMutation = useCreateWeightMutation();

  const form = useForm({
    defaultValues: {
      weight: '',
      date: new Date().toISOString().split('T')[0],
    },
    onSubmit: async ({ value }) => {
      try {
        const newWeight = await createWeightMutation.mutateAsync({
          userId,
          weight: parseFloat(value.weight),
          date: value.date,
        });
        onSuccess?.(newWeight);

        form.reset();
      } catch (error) {
        let errorMessage = 'Failed to create weight';

        if (
          error &&
          typeof error === 'object' &&
          'errors' in error &&
          Array.isArray(error.errors) &&
          error.errors.length > 0
        ) {
          errorMessage = error.errors[0].message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        onError?.(new Error(errorMessage));
      }
    },
  });

  return (
    <Stack sx={{ maxWidth: 400, width: '100%' }} justifyContent="center">
      {createWeightMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(
            createWeightMutation.error as {
              errors?: Array<{ message: string }>;
            }
          ).errors?.[0]?.message ||
            createWeightMutation.error.message ||
            'An error occurred while creating the weight'}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          width: '100%',
        }}
      >
        <form.Field
          name="weight"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Weight is required';

              const numValue = parseFloat(value);
              if (isNaN(numValue)) return 'Weight must be a valid number';
              if (numValue < 25) return 'Weight must be greater than 24';
              if (numValue > 250) return 'Weight must be less than 251';

              return undefined;
            },
          }}
          children={(field) => (
            <Box>
              <TextField
                fullWidth
                label="Weight"
                type="number"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.isTouched && !field.state.meta.isValid}
                disabled={createWeightMutation.isPending}
                variant="outlined"
                placeholder="Enter weight"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 1000,
                    step: 0.1,
                  },
                }}
              />
              <FieldInfo field={field} />
            </Box>
          )}
        />

        <form.Field
          name="date"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Date is required';

              const selectedDate = new Date(value);
              const today = new Date();

              if (selectedDate > today) {
                return 'Date cannot be in the future';
              }

              return undefined;
            },
          }}
          children={(field) => (
            <Box>
              <TextField
                fullWidth
                label="Date"
                type="date"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.isTouched && !field.state.meta.isValid}
                disabled={createWeightMutation.isPending}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FieldInfo field={field} />
            </Box>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit]) => (
            <Button
              type="submit"
              variant="contained"
              disabled={!canSubmit || createWeightMutation.isPending}
              fullWidth
              sx={{ mt: 1 }}
            >
              {createWeightMutation.isPending
                ? 'Adding Weight...'
                : 'Add Weight'}
            </Button>
          )}
        />
      </Box>
    </Stack>
  );
};

export default AddWeightForm;
