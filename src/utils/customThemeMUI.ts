import { createTheme } from '@mui/material/styles';

const customThemeMUI = createTheme({
  palette: {
    mode: 'light', // Force light mode
  },
});

export default customThemeMUI;