import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { formatItems } from '../../../utils/sharedFunctions';
import { USER_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
import { useFetchAllRolesQuery } from '../../../store/services';

import FileUpload from '../../FileUpload/FileUpload';
import Preloader from '../../Preloader/Preloader';
import BaseForm from '../BaseForm/BaseForm';

import { stylesUserFormPasswordButton } from '../../../styles';

function UserForm({
  isSubmitting,
  isChanging,
  onRemove,
  onUpload,
  onReset,
  user = null,
  onSubmit,
}) {
  const navigate = useNavigate();
  const { uuid, fullName, email, role, photo } = user ?? {};

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
    {
      name: 'role',
      label: 'Роль',
      type: 'select',
      options: formatItems(roles, 'title', 'title'),
      placeholder: 'Наприклад "User"',
    },
  ];

  const handleChangePassword = useCallback(() => {
    navigate(`/users/password/${uuid}`);
  }, [navigate, uuid]);

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
        <Button
          color='success'
          variant='contained'
          onClick={handleChangePassword}
        >
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
        submitButtonText='Зберегти зміни'
        validationSchema={USER_VALIDATION_SCHEME}
        onSubmit={onSubmit}
      />
    </>
  );
}

export default UserForm;
