import { Box, Button, IconButton, LinearProgress } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
// ==============================================================
import { BASE_URL } from '../../constants';

function FileUpload({ file, onUpload, onRemove, label, entity, uploading }) {
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && onUpload) {
      await onUpload(selectedFile);
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '120px',
          height: '120px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={
            file
              ? `${BASE_URL.replace('/api/', '')}/images/${entity}/${file}`
              : `${BASE_URL.replace('/api/', '')}/images/noLogo.png`
          }
          alt={file ? 'Файл завантажений' : 'Файл не завантажений'}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
        {file && (
          <IconButton
            size='small'
            color='error'
            onClick={onRemove}
            sx={{
              position: 'absolute',
              top: 1,
              right: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              ':hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            <ClearIcon fontSize='small' />
          </IconButton>
        )}
      </Box>
      {uploading && <LinearProgress sx={{ width: '100%', mt: 1 }} />}
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
