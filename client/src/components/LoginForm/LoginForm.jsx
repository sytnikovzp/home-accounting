import { Formik, Form, Field } from 'formik';
// ==============================================================
import { Box, TextField, Avatar, Button, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// ==============================================================
import { LOGIN_FORM_INITIAL } from '../../constants';
import { LOGIN_VALIDATION_SCHEME } from '../../utils/validationSchemes';

function LoginForm({ onSubmit }) {
  const renderForm = ({ errors, touched, isValid }) => {
    return (
      <Form>
        <Avatar
          sx={{
            mx: 'auto',
            bgcolor: 'success.light',
            width: 50,
            height: 50,
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
          Авторизация
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Field
            name='email'
            as={TextField}
            label='E-mail'
            placeholder='example@gmail.com'
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
          <Field
            name='password'
            as={TextField}
            label='Пароль'
            placeholder='Qwerty12'
            fullWidth
            required
            type='password'
            sx={{ mb: 2 }}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
        </Box>
        <Button
          type='submit'
          variant='contained'
          color='success'
          size='large'
          fullWidth
          disabled={!isValid}
          sx={{ mt: 2 }}
        >
          Увійти
        </Button>
      </Form>
    );
  };

  return (
    <Formik
      initialValues={LOGIN_FORM_INITIAL}
      validationSchema={LOGIN_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      validateOnMount
    >
      {renderForm}
    </Formik>
  );
}

export default LoginForm;
