import { useCallback, useMemo } from 'react';
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Clear } from '@mui/icons-material';

import { configs } from '../../constants';

import {
  stylesFileUploadAvatar,
  stylesFileUploadAvatarBox,
  stylesFileUploadIconButton,
  stylesFileUploadMainBox,
} from '../../styles';

const { BASE_URL } = configs;

function FileUpload({
  file,
  onUpload,
  onRemove,
  label,
  entity,
  isLoading,
  error,
}) {
  const avatarSrc = useMemo(() => {
    if (file) {
      return `${BASE_URL.replace('/api/', '')}/images/${entity}/${file}`;
    }
    return `${BASE_URL.replace('/api/', '')}/images/noLogo.png`;
  }, [file, entity]);

  const handleFileChange = useCallback(
    async (event) => {
      const [selectedFile] = event.target.files;
      if (selectedFile && onUpload) {
        await onUpload(selectedFile);
      }
    },
    [onUpload]
  );

  return (
    <Box sx={stylesFileUploadMainBox}>
      {error && (
        <Alert severity={error?.severity || 'error'} sx={{ mb: 1 }}>
          <AlertTitle>{error?.title || 'error'}:</AlertTitle>
          {error?.message || 'error'}
        </Alert>
      )}

      <Box sx={stylesFileUploadAvatarBox}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
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
          </>
        )}
      </Box>

      <Button
        color='success'
        component='label'
        disabled={isLoading}
        variant='contained'
      >
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
