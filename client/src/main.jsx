import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import CssBaseline from '@mui/material/CssBaseline';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ukUA } from '@mui/material/locale';

import store from './store';

import App from './App';

const theme = createTheme({}, ukUA);

createRoot(document.querySelector('#root')).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>
);
