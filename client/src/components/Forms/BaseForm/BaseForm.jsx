import { useCallback } from 'react';
import { Form, Formik } from 'formik';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import FormFields from '../FormFields/FormFields';

function BaseForm({
  fields,
  initialValues,
  isSubmitting = true,
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
          {renderField('product', { sx: { mb: 1 } })}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {renderField('quantity', { sx: { width: '40%' } })}
            {renderField('measure', { sx: { flex: 1 } })}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {renderField('unitPrice', { sx: { width: '40%' } })}
            {renderField('currency', { sx: { flex: 1 } })}
          </Box>
          {renderField('establishment', { sx: { mb: 1 } })}
          {renderField('date', { sx: { mb: 1 } })}
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
      <>{renderFields(fields, errors, touched, layout)}</>
      {customContent}
      <Button
        fullWidth
        color='success'
        disabled={!isValid || isSubmitting}
        size='large'
        type='submit'
        variant='contained'
      >
        {submitButtonText}
      </Button>
    </Form>
  );

  const handleSubmit = useCallback(
    async (values, actions) => {
      try {
        await onSubmit(values, actions);
      } catch (error) {
        actions.setSubmitting(false);
        if (error.response?.data?.message) {
          actions.setFieldError('general', error.response.data.message);
        }
      }
    },
    [onSubmit]
  );

  return (
    <Formik
      validateOnMount
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {renderForm}
    </Formik>
  );
}

export default BaseForm;
