import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { formatItems } from '@/src/utils/selectHelpers';
import { USER_VALIDATION_SCHEME } from '@/src/utils/validationSchemes';
import useHasPermission from '@/src/hooks/useHasPermission';

import { useFetchAllRolesQuery } from '@/src/store/services';

import FileUpload from '@/src/components/FileUpload';
import BaseForm from '@/src/components/forms/BaseForm';
import Preloader from '@/src/components/Preloader';

import { stylesUserFormPasswordButton } from '@/src/styles';

function UserForm({
  isChanging,
  isSubmitting,
  user = null,
  onPassword,
  onRemove,
  onReset,
  onSubmit,
  onUpload,
}) {
  const { hasPermission } = useHasPermission();
  const { fullName, email, role, photo } = user ?? {};

  const { data: rolesData, isFetching } = useFetchAllRolesQuery({
    page: 1,
    limit: 500,
    sort: 'title',
  });

  const roles = rolesData?.data ?? [];

  const initialValues = useMemo(
    () => ({
      fullName: fullName || '',
      email: email || '',
      role: role?.title || '',
    }),
    [fullName, email, role]
  );

  const renderFields = [
    {
      name: 'fullName',
      label: 'Повне ім’я',
      placeholder: 'Іван Іванов',
      required: true,
      autoFocus: true,
    },
    {
      name: 'email',
      label: 'E-mail',
      placeholder: 'example@gmail.com',
    },
    hasPermission('roles', 'assign') && {
      name: 'role',
      label: 'Роль',
      type: 'select',
      options: formatItems(roles, 'title', 'title'),
      placeholder: 'Наприклад "Users"',
    },
  ].filter(Boolean);

  if (isFetching) {
    return <Preloader />;
  }

  return (
    <>
      <FileUpload
        entity='users'
        file={photo}
        isChanging={isChanging}
        label={photo ? 'Оновити фото' : 'Завантажити фото'}
        onReset={onReset}
        onUpload={onUpload}
      />
      <Box sx={stylesUserFormPasswordButton}>
        <Button color='success' variant='contained' onClick={onPassword}>
          Змінити пароль
        </Button>
        <Button color='error' variant='contained' onClick={onRemove}>
          Видалити профіль
        </Button>
      </Box>
      <BaseForm
        fields={renderFields}
        initialValues={initialValues}
        isSubmitting={isSubmitting}
        validationSchema={USER_VALIDATION_SCHEME}
        onSubmit={onSubmit}
      />
    </>
  );
}

export default UserForm;
