import { PASSWORD_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

function ChangePasswordForm({ onSubmit }) {
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
      initialValues={initialValues}
      validationSchema={PASSWORD_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText='Змінити пароль'
    />
  );
}

export default ChangePasswordForm;
