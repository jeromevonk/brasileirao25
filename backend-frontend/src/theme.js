import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#008080',
    },
    secondary: {
      main: '#0e609e',
    },
    error: {
      main: red.A400,
    },
    action: {
      hover: '#008080'
    }
  },
});

export default theme;
