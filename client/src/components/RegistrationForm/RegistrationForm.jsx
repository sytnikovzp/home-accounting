import { Formik, Form, Field } from 'formik';
// ==============================================================
import { Box, TextField, Avatar, Button, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// ==============================================================
import { REGISTRATION_FORM_INITIAL } from '../../constants';
import { REGISTRATION_VALIDATION_SCHEME } from '../../utils/validationSchemes';
import {
  stylesAuthTitle,
  stylesRegistrationAvatar,
} from '../../services/styleService';

function RegistrationForm({ onSubmit }) {
  const renderForm = ({ errors, touched, isValid }) => {
    return (
      <Form>
        <Avatar sx={stylesRegistrationAvatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5' sx={stylesAuthTitle}>
          Реєстрація
        </Typography>
        <Box sx={{ mt: 3 }}>
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
          sx={{ mt: 2 }}
        >
          Зареєструватися та увійти
        </Button>
      </Form>
    );
  };

  return (
    <Formik
      initialValues={REGISTRATION_FORM_INITIAL}
      validationSchema={REGISTRATION_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      validateOnMount
    >
      {renderForm}
    </Formik>
  );
}

export default RegistrationForm;
