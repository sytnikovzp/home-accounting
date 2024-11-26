import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ukUA } from '@mui/material/locale';
// ==============================================================
import App from './App.jsx';
import './index.css';

const theme = createTheme({}, ukUA);

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
