import { useCallback, useMemo } from 'react';

import { ROLE_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
import { useFetchAllPermissionsQuery } from '../../../store/services';

import Preloader from '../../Preloader/Preloader';
import BaseForm from '../BaseForm/BaseForm';
import PermissionsSwitches from '../PermissionsSwitches/PermissionsSwitches';

function RoleForm({ isSubmitting, role = null, onSubmit }) {
  const { uuid, title = '', description = '', permissions = [] } = role ?? {};

  const { data: responseData, isLoading: isFetchingPermissions } =
    useFetchAllPermissionsQuery();

  const permissionsList = useMemo(() => responseData ?? [], [responseData]);

  const permissionMap = useMemo(
    () =>
      permissionsList.reduce((acc, permission) => {
        acc[permission.uuid] = permission.title;
        return acc;
      }, {}),
    [permissionsList]
  );

  const initialValues = useMemo(
    () => ({
      title,
      description,
      permissions: permissions.map((p) => p.uuid) || [],
    }),
    [title, description, permissions]
  );

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

  const handleSubmit = useCallback(
    (values) => {
      const permissionsTitles = values.permissions
        .map((uuid) => permissionMap[uuid])
        .filter(Boolean);
      onSubmit({ ...values, permissions: permissionsTitles });
    },
    [onSubmit, permissionMap]
  );

  if (isFetchingPermissions) {
    return <Preloader />;
  }

  const customContent = (
    <PermissionsSwitches permissionsList={permissionsList} />
  );

  return (
    <BaseForm
      customContent={customContent}
      fields={fields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      submitButtonText={uuid ? 'Зберегти зміни' : 'Додати роль'}
      validationSchema={ROLE_VALIDATION_SCHEME}
      onSubmit={handleSubmit}
    />
  );
}

export default RoleForm;
