import { LOGIN_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function LoginForm({ isLoading, onSubmit }) {
  const initialValues = {
    email: '',
    password: '',
  };

  const fields = [
    {
      name: 'email',
      label: 'E-mail',
      placeholder: 'example@gmail.com',
      autoFocus: true,
    },
    {
      name: 'password',
      label: 'Пароль',
      placeholder: 'Qwerty12',
      type: 'password',
    },
  ];

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      isLoading={isLoading}
      submitButtonText='Увійти'
      validationSchema={LOGIN_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default LoginForm;
