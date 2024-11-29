import { REGISTRATION_FORM_INITIAL } from '../../constants';
import { REGISTRATION_VALIDATION_SCHEME } from '../../utils/validationSchemes';
// ==============================================================
import AuthForm from '../AuthForm/AuthForm';

function RegistrationForm({ onSubmit }) {
  const fields = [
    {
      name: 'fullName',
      label: 'Повне ім’я',
      placeholder: 'Іван Іванов',
      autoFocus: true,
    },
    {
      name: 'email',
      label: 'E-mail',
      placeholder: 'example@gmail.com',
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
      initialValues={REGISTRATION_FORM_INITIAL}
      validationSchema={REGISTRATION_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText='Зареєструватися та увійти'
    />
  );
}

export default RegistrationForm;
