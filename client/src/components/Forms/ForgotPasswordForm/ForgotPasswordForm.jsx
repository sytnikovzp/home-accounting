import { FORGOT_PASSWORD_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function ForgotPasswordForm({ isLoading, onSubmit }) {
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
      fields={fields}
      initialValues={initialValues}
      isLoading={isLoading}
      submitButtonText='Запросити зміну паролю'
      validationSchema={FORGOT_PASSWORD_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ForgotPasswordForm;
