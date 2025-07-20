import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useGetUserQuery } from './lib/api';
import WeightsTable from '../weights/WeightsTable';
import AddWeightForm from '../weights/AddWeightForm';
import { useEffect } from 'react';

interface UserDetailsProps {
  userId: string;
}

export default function UserDetails({ userId }: UserDetailsProps) {
  const { data: user, isLoading, error } = useGetUserQuery(userId);

  useEffect(() => {
    console.log('user', user);
  }, [user]);

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
          <Typography variant="h6" component="h2" gutterBottom>
            {user.name}
          </Typography>

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
          <WeightsTable
            weights={user.weights || []}
            onDelete={() => {
              // Refetch user data after deletion to update the UI
              // The delete mutation already invalidates the cache
            }}
          />
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
