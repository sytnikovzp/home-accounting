import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '../../../constants';
import { FORGOT_PASSWORD_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

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
