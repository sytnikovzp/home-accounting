import { Formik, Form } from 'formik';
// ==============================================================
import { Box, Avatar, Button, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// ==============================================================
import { stylesAuthAvatar, stylesAuthTitle } from '../../styles/theme';
// ==============================================================
import { REGISTRATION_FORM_INITIAL } from '../../constants';
import { REGISTRATION_VALIDATION_SCHEME } from '../../utils/validationSchemes';
// ==============================================================
import FormField from '../FormField/FormField';

function RegistrationForm({ onSubmit }) {
  const renderForm = ({ errors, touched, isValid }) => {
    return (
      <Form>
        <Avatar sx={{ ...stylesAuthAvatar, bgcolor: 'success.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h6' sx={stylesAuthTitle}>
          Реєстрація
        </Typography>
        <Box sx={{ mt: 2 }}>
          <FormField
            name='fullName'
            label='Повне імʼя'
            placeholder='Іван Іванов'
            autoFocus={true}
            error={errors.fullName}
            touched={touched.fullName}
          />
          <FormField
            name='email'
            label='E-mail'
            placeholder='example@gmail.com'
            error={errors.email}
            touched={touched.email}
          />
          <FormField
            name='password'
            label='Пароль'
            placeholder='Qwerty12'
            type='password'
            error={errors.password}
            touched={touched.password}
          />
        </Box>
        <Button
          type='submit'
          variant='contained'
          color='success'
          size='large'
          fullWidth
          disabled={!isValid}
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
