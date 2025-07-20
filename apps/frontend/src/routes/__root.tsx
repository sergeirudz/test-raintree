import { Outlet, createRootRoute, Link } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AppBar, Toolbar, Button, Box } from '@mui/material';

export const Route = createRootRoute({
  component: () => (
    <>
      <AppBar position="static">
        <Toolbar>
          <a
            href="https://www.raintreeinc.com/"
            rel="nofollow noopener"
            target="_blank"
          >
            <Box
              component="img"
              sx={{
                height: 'auto',
                maxHeight: { xs: 60, md: 50 },
                maxWidth: { xs: 200, md: 180 },
                objectFit: 'contain',
              }}
              alt="Raintree Inc. Logo"
              src="/raintree-logo.png"
            />
          </a>
          <Box sx={{ display: 'flex', ml: 'auto', gap: 2 }}>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/create-user">
              Create User
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
