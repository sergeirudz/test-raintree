import { createFileRoute } from '@tanstack/react-router';

import UsersTable from '@/components/users/UsersTable';
import CreateUserForm from '@/components/users/CreateUserForm';
import { Stack, Typography } from '@mui/material';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <Stack direction="column">
      <Typography variant="h4" component="h1">
        Patients
      </Typography>
      <UsersTable />
      <CreateUserForm />
    </Stack>
  );
}
