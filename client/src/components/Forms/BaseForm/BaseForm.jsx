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
  layout,
}) {
  const renderForm = ({ errors, touched, isValid, isSubmitting }) => (
    <Form>
      <Box sx={{ mt: 2 }}>
        {layout === 'purchase' ? (
          <>
            <Box sx={{ mb: 2 }}>
              <FormField
                {...fields.find((field) => field.name === 'product')}
                error={errors['product']}
                touched={touched['product']}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <FormField
                  {...fields.find((field) => field.name === 'amount')}
                  error={errors['amount']}
                  touched={touched['amount']}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormField
                  {...fields.find((field) => field.name === 'measure')}
                  error={errors['measure']}
                  touched={touched['measure']}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <FormField
                  {...fields.find((field) => field.name === 'price')}
                  error={errors['price']}
                  touched={touched['price']}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormField
                  {...fields.find((field) => field.name === 'currency')}
                  error={errors['currency']}
                  touched={touched['currency']}
                />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormField
                {...fields.find((field) => field.name === 'shop')}
                error={errors['shop']}
                touched={touched['shop']}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormField
                {...fields.find((field) => field.name === 'date')}
                error={errors['date']}
                touched={touched['date']}
              />
            </Box>
          </>
        ) : (
          fields.map(
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
