import { useForm } from '@tanstack/react-form';
import type { AnyFieldApi } from '@tanstack/react-form';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { useCreateUserMutation } from './lib/api';

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

interface User {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserProps {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
}

export default function CreateUserForm({
  onSuccess,
  onError,
}: CreateUserProps) {
  const createUserMutation = useCreateUserMutation();

  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const newUser = await createUserMutation.mutateAsync({
          name: value.name,
        });

        console.log('User created successfully:', newUser);
        onSuccess?.(newUser);

        // Reset form after successful submission
        form.reset();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to create user';
        console.error('Error creating user:', error);
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Create New User
      </Typography>

      {createUserMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {createUserMutation.error.message}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Name is required'
                : value.length < 2
                  ? 'Name must be at least 2 characters'
                  : value.length > 50
                    ? 'Name must be less than 50 characters'
                    : undefined,
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              // Simulate async validation (e.g., checking if name is unique)
              await new Promise((resolve) => setTimeout(resolve, 500));
              return (
                value.toLowerCase().includes('admin') &&
                'Names containing "admin" are not allowed'
              );
            },
          }}
          children={(field) => (
            <Box>
              <TextField
                fullWidth
                label="Name"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.isTouched && !field.state.meta.isValid}
                disabled={createUserMutation.isPending}
                variant="outlined"
                placeholder="Enter user name"
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
              disabled={!canSubmit || createUserMutation.isPending}
              fullWidth
              sx={{ mt: 1 }}
            >
              {createUserMutation.isPending
                ? 'Creating User...'
                : 'Create User'}
            </Button>
          )}
        />
      </Box>
    </Box>
  );
}
