import { useCallback, useMemo } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import ClearIcon from '@mui/icons-material/Clear';

import { configs } from '../../constants';

import {
  stylesFileUploadAvatar,
  stylesFileUploadAvatarBox,
  stylesFileUploadIconButton,
  stylesFileUploadMainBox,
} from '../../styles';

const { BASE_URL } = configs;

function FileUpload({ entity, file, isChanging, label, onReset, onUpload }) {
  const avatarPath = useMemo(() => {
    if (file) {
      return `${BASE_URL.replace('/api', '')}/images/${entity}/${file}`;
    }
    if (entity === 'users') {
      return null;
    }
    return `${BASE_URL.replace('/api', '')}/images/noLogo.png`;
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
      <Box sx={stylesFileUploadAvatarBox}>
        {isChanging ? (
          <CircularProgress color='success' />
        ) : (
          <>
            <Avatar
              alt={file ? 'Файл завантажений' : 'Файл не завантажений'}
              src={avatarPath}
              sx={stylesFileUploadAvatar}
              variant='rounded'
            />
            {file && (
              <Tooltip title='Видалити'>
                <IconButton
                  color='error'
                  size='small'
                  sx={stylesFileUploadIconButton}
                  onClick={onReset}
                >
                  <ClearIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </Box>
      <Button
        color='success'
        component='label'
        disabled={isChanging}
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
