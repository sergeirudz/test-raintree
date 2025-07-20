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
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    },
    onSubmit: async ({ value }) => {
      try {
        const newWeight = await createWeightMutation.mutateAsync({
          userId,
          weight: parseFloat(value.weight),
          date: value.date,
        });

        console.log('Weight created successfully:', newWeight);
        onSuccess?.(newWeight);

        // Reset form after successful submission
        form.reset();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to create weight';
        console.error('Error creating weight:', error);
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    },
  });

  return (
    <Stack sx={{ maxWidth: 400, width: '100%' }} justifyContent="center">
      {createWeightMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {createWeightMutation.error.message}
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
              if (numValue <= 0) return 'Weight must be greater than 0';
              if (numValue > 1000) return 'Weight must be less than 1000';

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
