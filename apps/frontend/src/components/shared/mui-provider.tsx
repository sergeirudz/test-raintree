import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { PropsWithChildren } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
});

export default function MuiProvider({ children }: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
