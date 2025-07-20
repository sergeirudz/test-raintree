import { useAuth } from '../../lib/auth';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

export function Login() {
  const { isAuthenticated, isLoading, error, login } = useAuth();

  if (isAuthenticated) {
    return null; // Don't show login if already authenticated
  }

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
        <Alert severity="error">
          <Typography variant="h6">Authentication Error</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
          <Button
            onClick={login}
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
          >
            Retry Login
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Card sx={{ m: 'auto' }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Please login to access the patient data.
        </Typography>

        <Button
          onClick={login}
          variant="outlined"
          loading={isLoading}
          size="large"
        >
          Login
        </Button>
      </CardContent>
    </Card>
  );
}
