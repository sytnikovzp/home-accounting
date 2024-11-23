import { Formik, Form } from 'formik';
// ==============================================================
import { Box, Button } from '@mui/material';
// ==============================================================
import { LOGIN_FORM_INITIAL } from '../../constants';
import { LOGIN_VALIDATION_SCHEME } from '../../utils/validationSchemes';
// ==============================================================
import FormField from '../FormField/FormField';

function LoginForm({ onSubmit }) {
  const renderForm = ({ errors, touched, isValid }) => {
    return (
      <Form>
        <Box sx={{ mt: 2 }}>
          <FormField
            name='email'
            label='E-mail'
            placeholder='example@gmail.com'
            autoFocus={true}
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
