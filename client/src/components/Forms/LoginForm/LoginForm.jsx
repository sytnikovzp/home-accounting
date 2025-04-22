import { LOGIN_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function LoginForm({ isSubmitting, onSubmit }) {
  const initialValues = {
    email: '',
    password: '',
  };

  const renderFields = [
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
      fields={renderFields}
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
