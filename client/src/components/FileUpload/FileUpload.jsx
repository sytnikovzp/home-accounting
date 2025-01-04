import { Avatar, Box, Button, IconButton, LinearProgress } from '@mui/material';
import { Clear } from '@mui/icons-material';

import { BASE_URL } from '../../constants';

import {
  stylesFileUploadAvatar,
  stylesFileUploadAvatarBox,
  stylesFileUploadIconButton,
  stylesFileUploadLinearProgress,
  stylesFileUploadMainBox,
} from '../../styles';

function FileUpload({ file, onUpload, onRemove, label, entity, uploading }) {
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && onUpload) {
      await onUpload(selectedFile);
    }
  };

  return (
    <Box sx={stylesFileUploadMainBox}>
      <Box sx={stylesFileUploadAvatarBox}>
        <Avatar
          alt={file ? 'Файл завантажений' : 'Файл не завантажений'}
          src={
            file
              ? `${BASE_URL.replace('/api/', '')}/images/${entity}/${file}`
              : entity === 'users'
                ? undefined
                : `${BASE_URL.replace('/api/', '')}/images/noLogo.png`
          }
          sx={stylesFileUploadAvatar}
          variant='rounded'
        />
        {file && (
          <IconButton
            color='error'
            size='small'
            sx={stylesFileUploadIconButton}
            onClick={onRemove}
          >
            <Clear fontSize='small' />
          </IconButton>
        )}
      </Box>
      {uploading && <LinearProgress sx={stylesFileUploadLinearProgress} />}
      <Button color='success' component='label' variant='contained'>
        {label}
        <input
          hidden
          accept='image/*'
          type='file'
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  );
}

export default FileUpload;
