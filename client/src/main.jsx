// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import { ukUA } from '@mui/material/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import store from './store';

import App from './App.jsx';

import './index.css';

const theme = createTheme({}, ukUA);

createRoot(document.querySelector('#root')).render(
  // <StrictMode>
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>
  // </StrictMode>
);
