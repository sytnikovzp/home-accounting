import { Form, Formik } from 'formik';
import { Box, Button } from '@mui/material';

import FormFields from '../FormFields/FormFields';

import { stylesBaseFormButtomBox } from '../../../styles';

function BaseForm({
  fields,
  initialValues,
  isLoading = true,
  submitButtonText,
  validationSchema,
  onSubmit,
  layout,
  customContent,
}) {
  const renderFields = (fields, errors, touched, layout) => {
    if (layout === 'expense') {
      const renderField = (name, wrapperProps = {}) => {
        const field = fields.find((field) => field.name === name);
        return (
          <Box {...wrapperProps}>
            <FormFields
              {...field}
              error={errors[name]}
              touched={touched[name]}
            />
          </Box>
        );
      };

      return (
        <>
          {renderField('product', { sx: { mb: 2 } })}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {renderField('quantity', { sx: { width: '40%' } })}
            {renderField('measure', { sx: { flex: 1 } })}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {renderField('unitPrice', { sx: { width: '40%' } })}
            {renderField('currency', { sx: { flex: 1 } })}
          </Box>
          {renderField('establishment', { sx: { mb: 2 } })}
          {renderField('date', { sx: { mb: 2 } })}
        </>
      );
    }

    return fields.map((field) => (
      <FormFields
        key={field.name}
        {...field}
        error={errors[field.name]}
        touched={touched[field.name]}
      />
    ));
  };

  const renderForm = ({ errors, touched, isValid }) => (
    <Form>
      <Box sx={{ mt: 2 }}>{renderFields(fields, errors, touched, layout)}</Box>
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
