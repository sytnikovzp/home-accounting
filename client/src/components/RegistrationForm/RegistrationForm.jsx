import { Formik, Form, Field } from 'formik';
// ==============================================================
import { Box, TextField, Avatar, Button, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// ==============================================================
import { REGISTRATION_FORM_INITIAL } from '../../constants';
// ==============================================================
import { REGISTRATION_VALIDATION_SCHEME } from '../../utils/validationSchemes';

function RegistrationForm({ onRegister }) {
  const onFormSubmit = ({ fullName, email, password }) => {
    onRegister(fullName, email, password);
  };

  const renderForm = ({ errors, touched, isValid }) => {
    return (
      <Form id='registration-form'>
        <Avatar
          sx={{
            mx: 'auto',
            bgcolor: 'success.main',
            textAlign: 'center',
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
          Реєстрація
        </Typography>
        <Box noValidate sx={{ mt: 3 }}>
          <Field
            name='fullName'
            as={TextField}
            label='Повне імʼя'
            placeholder='Іван Іванов'
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            error={touched.fullName && Boolean(errors.fullName)}
            helperText={touched.fullName && errors.fullName}
          />
          <Field
            name='email'
            as={TextField}
            label='E-mail'
            placeholder='example@gmail.com'
            fullWidth
            required
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
          sx={{ mt: 2, mb: 2 }}
        >
          Зареєструватися та увійти
        </Button>
      </Form>
    );
  };

  return (
    <Formik
      initialValues={REGISTRATION_FORM_INITIAL}
      onSubmit={onFormSubmit}
      validationSchema={REGISTRATION_VALIDATION_SCHEME}
      validateOnMount={true}
      enableReinitialize
    >
      {renderForm}
    </Formik>
  );
}

export default RegistrationForm;
