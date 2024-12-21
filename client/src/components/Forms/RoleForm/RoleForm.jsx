import { ROLE_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';
import PermissionsSwitches from '../PermissionsSwitches/PermissionsSwitches';

function RoleForm({ role = null, onSubmit, permissionsList = [] }) {
  const permissionMap = permissionsList.reduce((acc, permission) => {
    acc[permission.uuid] = permission.title;
    return acc;
  }, {});

  const initialValues = role
    ? {
        title: role.title,
        description: role.description,
        permissions: role.permissions.map((permission) => permission.uuid),
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
    },
  ];

  const handleSubmit = (values) => {
    const permissionsTitles = values.permissions
      .map((uuid) => permissionMap[uuid])
      .filter(Boolean);
    const payload = {
      ...values,
      permissions: permissionsTitles,
    };
    onSubmit(payload);
  };

  return (
    <BaseForm
      initialValues={initialValues}
      validationSchema={ROLE_VALIDATION_SCHEME}
      onSubmit={handleSubmit}
      fields={fields}
      submitButtonText={role ? 'Зберегти зміни' : 'Додати роль'}
      customContent={<PermissionsSwitches permissionsList={permissionsList} />}
    />
  );
}

export default RoleForm;
