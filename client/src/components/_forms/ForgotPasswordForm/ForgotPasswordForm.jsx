import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '@/src/constants';
import { FORGOT_PASSWORD_VALIDATION_SCHEME } from '@/src/utils/validationSchemes';

import BaseForm from '@/src/components/_forms/BaseForm/BaseForm';

function ForgotPasswordForm({ isSubmitting, onSubmit }) {
  const initialValues = useMemo(
    () => ({
      email: '',
    }),
    []
  );

  return (
    <BaseForm
      fields={FORM_RENDER_FIELDS.forgotPasswordFields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      layout='auth'
      submitButtonText='Відновити пароль'
      validationSchema={FORGOT_PASSWORD_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ForgotPasswordForm;
