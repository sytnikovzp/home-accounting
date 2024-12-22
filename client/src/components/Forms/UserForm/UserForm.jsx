import { useState } from 'react';
import { Box, Button } from '@mui/material';
// ==============================================================
import { UPDATE_USER_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';
import FileUpload from '../../FileUpload/FileUpload';

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
      options: [
        { value: '', label: 'Оберіть роль:' },
        ...roles.map((role) => ({
          value: role.title,
          label: role.title,
        })),
      ],
      placeholder: 'Наприклад "User"',
      required: true,
    },
  ];

  return (
    <>
      {user?.uuid && (
        <FileUpload
          file={user.photo}
          onUpload={async (file) => {
            setUploading(true);
            await onUploadPhoto(file);
            setUploading(false);
          }}
          onRemove={onRemovePhoto}
          label={user?.photo ? 'Оновити фото' : 'Завантажити фото'}
          entity='users'
          uploading={uploading}
        />
      )}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        {user?.uuid && (
          <Button
            variant='contained'
            color='success'
            onClick={onChangePassword}
          >
            Змінити пароль
          </Button>
        )}
      </Box>
      <BaseForm
        initialValues={initialValues}
        validationSchema={UPDATE_USER_VALIDATION_SCHEME}
        onSubmit={onSubmit}
        fields={fields}
        submitButtonText={'Зберегти зміни'}
      />
    </>
  );
}

export default UserForm;
