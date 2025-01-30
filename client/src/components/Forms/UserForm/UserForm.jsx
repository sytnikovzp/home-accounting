import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

import { formatItems } from '../../../utils/sharedFunctions';
import { USER_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
import { useFetchAllRolesQuery } from '../../../store/services';

import FileUpload from '../../FileUpload/FileUpload';
import Preloader from '../../Preloader/Preloader';
import BaseForm from '../BaseForm/BaseForm';

import { stylesUserFormPasswordButton } from '../../../styles';

function UserForm({
  isLoading,
  isRemoving,
  isChanging,
  onDelete,
  onUpload,
  onReset,
  user = null,
  onSubmit,
}) {
  const navigate = useNavigate();
  const { uuid, fullName, email, role, photo } = user ?? {};

  const { data: rolesData, isLoading: isFetchingRoles } = useFetchAllRolesQuery(
    { page: 1, limit: 500, sort: 'title' }
  );

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
      required: true,
    },
    {
      name: 'role',
      label: 'Роль',
      type: 'select',
      options: formatItems(roles, 'title', 'title'),
      placeholder: 'Наприклад "User"',
      required: true,
    },
  ];

  const handleChangePassword = () => {
    navigate(`/users/password/${uuid}`);
  };

  if (isFetchingRoles) {
    return <Preloader />;
  }

  return (
    <>
      {uuid && (
        <FileUpload
          entity='users'
          file={photo}
          isLoading={isChanging}
          label={photo ? 'Оновити фото' : 'Завантажити фото'}
          onReset={onReset}
          onUpload={onUpload}
        />
      )}
      {uuid && (
        <Box sx={stylesUserFormPasswordButton}>
          <Button
            color='success'
            variant='contained'
            onClick={handleChangePassword}
          >
            Змінити пароль
          </Button>
          <Button
            color='error'
            disabled={isRemoving}
            variant='contained'
            onClick={onDelete}
          >
            Видалити профіль
          </Button>
        </Box>
      )}
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        isLoading={isLoading}
        submitButtonText='Зберегти зміни'
        validationSchema={USER_VALIDATION_SCHEME}
        onSubmit={onSubmit}
      />
    </>
  );
}

export default UserForm;
