import { Form, Formik } from 'formik';
import { Box, Button } from '@mui/material';

import FormFields from '../FormFields/FormFields';

import { stylesBaseFormButtomBox } from '../../../styles';

function BaseForm({
  initialValues,
  validationSchema,
  isLoading,
  onSubmit,
  fields,
  submitButtonText,
  layout,
  customContent,
}) {
  const renderForm = ({ errors, touched, isValid }) => (
    <Form>
      <Box sx={{ mt: 2 }}>
        {layout === 'expense' ? (
          <>
            <Box sx={{ mb: 2 }}>
              <FormFields
                {...fields.find((field) => field.name === 'product')}
                error={errors['product']}
                touched={touched['product']}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: '40%' }}>
                <FormFields
                  {...fields.find((field) => field.name === 'quantity')}
                  error={errors['quantity']}
                  touched={touched['quantity']}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormFields
                  {...fields.find((field) => field.name === 'measure')}
                  error={errors['measure']}
                  touched={touched['measure']}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: '40%' }}>
                <FormFields
                  {...fields.find((field) => field.name === 'unitPrice')}
                  error={errors['unitPrice']}
                  touched={touched['unitPrice']}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormFields
                  {...fields.find((field) => field.name === 'currency')}
                  error={errors['currency']}
                  touched={touched['currency']}
                />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormFields
                {...fields.find((field) => field.name === 'establishment')}
                error={errors['establishment']}
                touched={touched['establishment']}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormFields
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
              <FormFields
                key={name}
                autoFocus={autoFocus}
                error={errors[name]}
                label={label}
                name={name}
                options={options}
                placeholder={placeholder}
                required={required}
                touched={touched[name]}
                type={type}
              />
            )
          )
        )}
      </Box>
      {customContent}
      <Box sx={stylesBaseFormButtomBox}>
        <Button
          fullWidth
          color='success'
          disabled={!isValid || isLoading}
          size='large'
          type='submit'
          variant='contained'
        >
          {submitButtonText}
        </Button>
      </Box>
    </Form>
  );

  return (
    <Formik
      validateOnMount
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
    >
      {renderForm}
    </Formik>
  );
}

export default BaseForm;
