import { ROLE_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

function RoleForm({ role = null, onSubmit }) {
  const initialValues = role
    ? {
        title: role.title,
        description: role.description,
        permissions: role.permissions,
      }
    : { title: '', description: '', permissions: [] };

  const fields = [
    {
      name: 'title',
      label: 'Назва ролі',
      placeholder: 'Наприклад "Admin"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'description',
      label: 'Опис',
      placeholder: 'Наприклад "Адміністратори"',
      required: true,
    },
  ];

  return (
    <BaseForm
      initialValues={initialValues}
      validationSchema={ROLE_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText={role ? 'Зберегти зміни' : 'Додати роль'}
    />
  );
}

export default RoleForm;
