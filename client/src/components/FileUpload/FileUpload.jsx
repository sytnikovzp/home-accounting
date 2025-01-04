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
          src={
            file
              ? `${BASE_URL.replace('/api/', '')}/images/${entity}/${file}`
              : entity === 'users'
                ? undefined
                : `${BASE_URL.replace('/api/', '')}/images/noLogo.png`
          }
          alt={file ? 'Файл завантажений' : 'Файл не завантажений'}
          variant='rounded'
          sx={stylesFileUploadAvatar}
        />
        {file && (
          <IconButton
            size='small'
            color='error'
            onClick={onRemove}
            sx={stylesFileUploadIconButton}
          >
            <Clear fontSize='small' />
          </IconButton>
        )}
      </Box>
      {uploading && <LinearProgress sx={stylesFileUploadLinearProgress} />}
      <Button variant='contained' color='success' component='label'>
        {label}
        <input
          type='file'
          accept='image/*'
          hidden
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  );
}

export default FileUpload;
