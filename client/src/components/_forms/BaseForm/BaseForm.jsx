import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import FormFields from '@/src/components/_forms/FormFields/FormFields';

import { stylesBaseFormButtons, stylesBaseFormExpenseForm } from '@/src/styles';

function BaseForm({
  fields,
  initialValues,
  isSubmitting = true,
  submitButtonText = 'Зберегти',
  validationSchema,
  onSubmit,
  layout,
  customContent,
}) {
  const navigate = useNavigate();

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

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
          <Box sx={stylesBaseFormExpenseForm}>
            {renderField('quantity', { sx: { width: '40%' } })}
            {renderField('measure', { sx: { flex: 1 } })}
          </Box>
          <Box sx={stylesBaseFormExpenseForm}>
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
      <Box sx={stylesBaseFormButtons}>
        {layout !== 'auth' && (
          <Button color='default' variant='text' onClick={handleCancel}>
            Скасувати
          </Button>
        )}
        <Button
          color='success'
          disabled={!isValid || isSubmitting}
          fullWidth={layout === 'auth'}
          size={layout === 'auth' ? 'large' : 'medium'}
          type='submit'
          variant='contained'
        >
          {submitButtonText}
        </Button>
      </Box>
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
