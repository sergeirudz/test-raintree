import { Grid } from '@mui/material';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {}
const Layout = ({ children }: Props) => {
  return (
    <Grid
      spacing={0}
      sx={{
        justifyContent: 'center',
        mx: 'auto',
        maxWidth: {
          lg: '50vw',
        },
      }}
    >
      {children}
    </Grid>
  );
};
export default Layout;
