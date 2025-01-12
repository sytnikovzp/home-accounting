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
    const [selectedFile] = event.target.files;
    if (selectedFile && onUpload) {
      await onUpload(selectedFile);
    }
  };

  let avatarSrc = null;

  if (file) {
    avatarSrc = `${BASE_URL.replace('/api/', '')}/images/${entity}/${file}`;
  } else if (entity === 'users') {
    avatarSrc = null;
  } else {
    avatarSrc = `${BASE_URL.replace('/api/', '')}/images/noLogo.png`;
  }

  return (
    <Box sx={stylesFileUploadMainBox}>
      <Box sx={stylesFileUploadAvatarBox}>
        <Avatar
          alt={file ? 'Файл завантажений' : 'Файл не завантажений'}
          src={avatarSrc}
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
