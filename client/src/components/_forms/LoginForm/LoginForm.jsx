import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '@/src/constants';
import { LOGIN_VALIDATION_SCHEME } from '@/src/utils/validationSchemes';

import BaseForm from '@/src/components/_forms/BaseForm/BaseForm';

function LoginForm({ isSubmitting, onSubmit }) {
  const initialValues = useMemo(
    () => ({
      email: '',
      password: '',
    }),
    []
  );

  return (
    <BaseForm
      fields={FORM_RENDER_FIELDS.loginFields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      layout='auth'
      submitButtonText='Увійти'
      validationSchema={LOGIN_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default LoginForm;
