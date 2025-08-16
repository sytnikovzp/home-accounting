import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '@/src/constants';
import { REGISTRATION_VALIDATION_SCHEME } from '@/src/utils/validationSchemes';

import BaseForm from '@/src/components/forms/BaseForm';

function RegistrationForm({ isSubmitting, onSubmit }) {
  const initialValues = useMemo(
    () => ({
      fullName: '',
      email: '',
      password: '',
    }),
    []
  );

  return (
    <BaseForm
      fields={FORM_RENDER_FIELDS.registrationFields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      layout='auth'
      submitButtonText='Зареєструватися та увійти'
      validationSchema={REGISTRATION_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default RegistrationForm;
