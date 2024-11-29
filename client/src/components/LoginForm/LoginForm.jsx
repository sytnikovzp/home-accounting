import { LOGIN_FORM_INITIAL } from '../../constants';
import { LOGIN_VALIDATION_SCHEME } from '../../utils/validationSchemes';
// ==============================================================
import AuthForm from '../AuthForm/AuthForm';

function LoginForm({ onSubmit }) {
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
    <AuthForm
      initialValues={LOGIN_FORM_INITIAL}
      validationSchema={LOGIN_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText='Увійти'
    />
  );
}

export default LoginForm;
