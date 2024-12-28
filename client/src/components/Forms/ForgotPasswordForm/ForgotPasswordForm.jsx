import { FORGOT_PASSWORD_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

function ForgotPasswordForm({ onSubmit }) {
  const initialValues = {
    email: '',
  };

  const fields = [
    {
      name: 'email',
      label: 'E-mail',
      placeholder: 'example@gmail.com',
      autoFocus: true,
    },
  ];

  return (
    <BaseForm
      initialValues={initialValues}
      validationSchema={FORGOT_PASSWORD_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText='Запросити зміну паролю'
    />
  );
}

export default ForgotPasswordForm;
