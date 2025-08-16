import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '@/src/constants';
import { PASSWORD_VALIDATION_SCHEME } from '@/src/utils/validationSchemes';

import BaseForm from '@/src/components/forms/BaseForm';

function ChangePasswordForm({ onSubmit, isSubmitting }) {
  const initialValues = useMemo(
    () => ({
      newPassword: '',
      confirmNewPassword: '',
    }),
    []
  );

  return (
    <BaseForm
      fields={FORM_RENDER_FIELDS.changePasswordFields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      layout='auth'
      submitButtonText='Змінити пароль'
      validationSchema={PASSWORD_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ChangePasswordForm;
