import { useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';

import { USER_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import FileUpload from '../../FileUpload/FileUpload';
import BaseForm from '../BaseForm/BaseForm';

import { stylesUserFormPasswordButton } from '../../../styles';

function UserForm({
  user = null,
  onSubmit,
  roles,
  onUploadPhoto,
  onRemovePhoto,
  onChangePassword,
}) {
  const [uploading, setUploading] = useState(false);
  const initialValues = user
    ? {
        fullName: user.fullName,
        email: user.email,
        role: user.role.title,
      }
    : { fullName: '', email: '', role: '' };

  const sortedRoles = useMemo(
    () =>
      roles
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((role) => ({
          value: role.title,
          label: role.title,
        })),
    [roles]
  );

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
      options: sortedRoles,
      placeholder: 'Наприклад "User"',
      required: true,
    },
  ];

  return (
    <>
      {user?.uuid && (
        <FileUpload
          entity='users'
          file={user.photo}
          label={user?.photo ? 'Оновити фото' : 'Завантажити фото'}
          uploading={uploading}
          onRemove={onRemovePhoto}
          onUpload={async (file) => {
            setUploading(true);
            await onUploadPhoto(file);
            setUploading(false);
          }}
        />
      )}
      <Box sx={stylesUserFormPasswordButton}>
        {user?.uuid && (
          <Button
            color='success'
            variant='contained'
            onClick={onChangePassword}
          >
            Змінити пароль
          </Button>
        )}
      </Box>
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        submitButtonText={'Зберегти зміни'}
        validationSchema={USER_VALIDATION_SCHEME}
        onSubmit={onSubmit}
      />
    </>
  );
}

export default UserForm;
