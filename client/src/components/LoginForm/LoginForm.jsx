import { Link as RouterLink } from 'react-router-dom';
// ==============================================================
import {
  Avatar,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Grid2,
  Link,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginForm = () => {
  const handleSubmit = () => console.log('login');
  return (
    <Container maxWidth='xs'>
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
        <Avatar
          sx={{
            mx: 'auto',
            bgcolor: 'success.light',
            textAlign: 'center',
            width: 50,
            height: 50,
            mt: 2,
            mb: 2,
          }}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          component='h1'
          variant='h5'
          sx={{ textAlign: 'center', fontWeight: 600 }}
        >
          Авторизація
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            placeholder='example@gmail.com'
            label='E-mail'
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            placeholder='Qwerty12'
            label='Password'
            fullWidth
            required
            type='password'
            sx={{ mb: 2 }}
          />
          <Button
            type='submit'
            variant='contained'
            color="success"
            size="large"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Увійти
          </Button>
        </Box>
        <Grid2 container justifyContent='center' sx={{ m: 1 }}>
          <Grid2>
            <Link
              component={RouterLink}
              to='/register'
              sx={{ textDecoration: 'none' }}
            >
              Перейти до реєстрації
            </Link>
          </Grid2>
        </Grid2>
      </Paper>
    </Container>
  );
};

export default LoginForm;
