import { REGISTRATION_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function RegistrationForm({ isSubmitting, onSubmit }) {
  const initialValues = {
    fullName: '',
    email: '',
    password: '',
  };

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
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      submitButtonText='Зареєструватися та увійти'
      validationSchema={REGISTRATION_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default RegistrationForm;
