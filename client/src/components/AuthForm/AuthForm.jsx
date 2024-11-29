import { Formik, Form } from 'formik';
import { Box, Button } from '@mui/material';
// ==============================================================
import FormField from '../FormField/FormField';

function AuthForm({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  submitButtonText,
}) {
  const renderForm = ({ errors, touched, isValid }) => {
    return (
      <Form>
        <Box sx={{ mt: 2 }}>
          {fields.map(({ name, label, placeholder, autoFocus, type }) => (
            <FormField
              key={name}
              name={name}
              label={label}
              placeholder={placeholder}
              autoFocus={autoFocus}
              type={type}
              error={errors[name]}
              touched={touched[name]}
            />
          ))}
        </Box>
        <Button
          type='submit'
          variant='contained'
          color='success'
          size='large'
          fullWidth
          disabled={!isValid}
        >
          {submitButtonText}
        </Button>
      </Form>
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnMount
    >
      {renderForm}
    </Formik>
  );
}

export default AuthForm;
