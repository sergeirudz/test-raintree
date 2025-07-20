import { Grid } from '@mui/material';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {}
const Layout = ({ children }: Props) => {
  return (
    <Grid
      container
      spacing={0}
      sx={{
        justifyContent: 'center',
      }}
    >
      {children}
    </Grid>
  );
};
export default Layout;
