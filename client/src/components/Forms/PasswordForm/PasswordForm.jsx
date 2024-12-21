import { PASSWORD_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

function PasswordForm({ onSubmit }) {
  const initialValues = {
    newPassword: '',
    confirmNewPassword: '',
  };

  const fields = [
    {
      name: 'newPassword',
      label: 'Новий пароль',
      placeholder: 'Qwerty1234',
      type: 'password',
      autoFocus: true,
    },
    {
      name: 'confirmNewPassword',
      label: 'Повтор нового паролю',
      placeholder: 'Qwerty1234',
      type: 'password',
    },
  ];

  return (
    <BaseForm
      initialValues={initialValues}
      validationSchema={PASSWORD_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText='Змінити пароль'
    />
  );
}

export default PasswordForm;
