import { PASSWORD_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function ChangePasswordForm({ onSubmit, isSubmitting }) {
  const initialValues = {
    newPassword: '',
    confirmNewPassword: '',
  };

  const fields = [
    {
      name: 'newPassword',
      label: 'Новий пароль',
      placeholder: 'Qwerty12',
      type: 'password',
      required: true,
      autoFocus: true,
    },
    {
      name: 'confirmNewPassword',
      label: 'Повтор нового паролю',
      placeholder: 'Qwerty12',
      type: 'password',
      required: true,
    },
  ];

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      submitButtonText='Змінити пароль'
      validationSchema={PASSWORD_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ChangePasswordForm;
