import { Formik, Form } from 'formik';
import { Box, Button, Typography } from '@mui/material';
// ==============================================================
import FormField from '../FormField/FormField';

function BaseForm({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  submitButtonText,
  customActions,
  generalError,
}) {
  const renderForm = ({ errors, touched, isValid, isSubmitting }) => (
    <Form>
      <Box sx={{ mt: 2 }}>
        {fields.map(
          ({
            name,
            label,
            placeholder,
            required,
            autoFocus,
            type,
            options,
          }) => (
            <FormField
              key={name}
              name={name}
              label={label}
              placeholder={placeholder}
              required={required}
              autoFocus={autoFocus}
              type={type}
              options={options}
              error={errors[name]}
              touched={touched[name]}
            />
          )
        )}
      </Box>
      {generalError && (
        <Typography color='error' sx={{ mt: 1 }}>
          {generalError}
        </Typography>
      )}
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          type='submit'
          variant='contained'
          color='success'
          size='large'
          fullWidth
          disabled={!isValid || isSubmitting}
        >
          {submitButtonText}
        </Button>
        {customActions}
      </Box>
    </Form>
  );
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        try {
          await onSubmit(values, actions);
        } catch (error) {
          actions.setSubmitting(false);
          if (error.response?.data?.message) {
            actions.setFieldError('general', error.response.data.message);
          }
        }
      }}
      validateOnMount
    >
      {renderForm}
    </Formik>
  );
}

export default BaseForm;
