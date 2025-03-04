import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { formatItems } from '../../../utils/sharedFunctions';
import { USER_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
import useHasPermission from '../../../hooks/useHasPermission';

import { useFetchAllRolesQuery } from '../../../store/services';

import FileUpload from '../../FileUpload/FileUpload';
import Preloader from '../../Preloader/Preloader';
import BaseForm from '../BaseForm/BaseForm';

import { stylesUserFormPasswordButton } from '../../../styles';

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

  const { data: rolesData, isLoading: isFetching } = useFetchAllRolesQuery({
    page: 1,
    limit: 500,
    sort: 'title',
  });

  const roles = rolesData?.data ?? [];

  const initialValues = {
    fullName: fullName || '',
    email: email || '',
    role: role?.title || '',
  };

  const fields = [
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
        fields={fields}
        initialValues={initialValues}
        isSubmitting={isSubmitting}
        validationSchema={USER_VALIDATION_SCHEME}
        onSubmit={onSubmit}
      />
    </>
  );
}

export default UserForm;
