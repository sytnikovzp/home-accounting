import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '../../../constants';
import { REGISTRATION_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

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
