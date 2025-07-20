import { Outlet, createRootRoute, Link } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AppBar, Toolbar, Box } from '@mui/material';

export const Route = createRootRoute({
  component: () => (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'white', mb: 1 }}>
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
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: 'black',
                padding: '6px 16px',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
            >
              Home
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
