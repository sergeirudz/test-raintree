import { createFileRoute } from '@tanstack/react-router';
import CreateUserForm from '@/components/users/CreateUserForm';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import UsersDataTable from '@/components/users/UsersDataTable';
import Layout from '@/components/layout/layout';
import { Login } from '@/components/auth/Login';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Layout>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Login />
        {isAuthenticated && !isLoading && (
          <>
            <Typography variant="h4" component="h1">
              Patients
            </Typography>
            <UsersDataTable />

            <Card
              sx={{
                mt: 2,
                border: 'none',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <CardContent
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <CreateUserForm />
              </CardContent>
            </Card>
          </>
        )}
      </Stack>
    </Layout>
  );
}
