import { IconButton, Tooltip } from '@mui/material';
import { useAuth } from '../../lib/auth';
import LogoutIcon from '@mui/icons-material/Logout';

export function Logout() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null; // Don't show logout if not authenticated
  }

  return (
    <Tooltip title="Sign out">
      <IconButton onClick={logout}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
}
