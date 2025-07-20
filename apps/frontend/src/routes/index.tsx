import { createFileRoute } from '@tanstack/react-router';
import CreateUserForm from '@/components/users/CreateUserForm';
import { Stack, Typography } from '@mui/material';
import UsersDataTable from '@/components/users/UsersDataTable';
import Layout from '@/components/layout/layout';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <Layout>
      <Stack direction="column">
        <Typography variant="h4" component="h1">
          Patients
        </Typography>
        <UsersDataTable />
        <CreateUserForm />
      </Stack>
    </Layout>
  );
}
