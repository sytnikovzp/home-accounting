import { useCallback, useMemo } from 'react';

import Typography from '@mui/material/Typography';

import { ROLE_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import { useFetchAllPermissionsQuery } from '../../../store/services';

import Preloader from '../../Preloader/Preloader';
import BaseForm from '../BaseForm/BaseForm';
import PermissionsSelector from '../PermissionsSelector/PermissionsSelector';

function RoleForm({ isSubmitting, role = null, onSubmit }) {
  const { title, description, permissions = [] } = role ?? {};

  const { data: responseData, isLoading: isFetching } =
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

  const initialValues = {
    title: title || '',
    description: description || '',
    permissions: permissions.map((p) => p.uuid) || [],
  };

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

  if (isFetching) {
    return <Preloader />;
  }

  const customContent = (
    <>
      <Typography gutterBottom variant='h6'>
        Права доступу:
      </Typography>
      <PermissionsSelector permissionsList={permissionsList} />
    </>
  );

  return (
    <BaseForm
      customContent={customContent}
      fields={fields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      validationSchema={ROLE_VALIDATION_SCHEME}
      onSubmit={handleSubmit}
    />
  );
}

export default RoleForm;
