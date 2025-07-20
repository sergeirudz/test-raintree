import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useGetUserQuery } from './lib/api';
import AddWeightForm from '../weights/AddWeightForm';
import WeightsDataTable from '../weights/WeightsDataTable';
import UserNameField from './UserNameField';

interface UserDetailsProps {
  userId: string;
}

export default function UserDetails({ userId }: UserDetailsProps) {
  const { data: user, isLoading, error } = useGetUserQuery(userId);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load user: {error.message}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">User not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Details
      </Typography>

      <Card>
        <CardContent>
          <UserNameField name={user.name} userId={userId} />

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>ID:</strong> {user.id}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Created:</strong>{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Last Updated:</strong>{' '}
              {new Date(user.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            Weight History
          </Typography>
          <WeightsDataTable weights={user.weights || []} />
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            Add Weight
          </Typography>
          <AddWeightForm userId={userId} />
        </CardContent>
      </Card>
    </Box>
  );
}
