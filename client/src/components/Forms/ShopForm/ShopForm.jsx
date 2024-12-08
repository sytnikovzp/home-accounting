import { useState } from 'react';
import { Box, Button, IconButton, LinearProgress } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
// ==============================================================
import { BASE_URL } from '../../../constants';
import { PRODUCT_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

function ShopForm({ shop = null, onSubmit, onUploadLogo, onRemoveLogo }) {
  const [uploading, setUploading] = useState(false);

  const initialValues = shop
    ? {
        title: shop.title,
        description: shop.description,
        url: shop.url,
        logo: null,
      }
    : { title: '', description: '', url: '', logo: null };

  const fields = [
    {
      name: 'title',
      label: 'Назва магазину',
      placeholder: 'Наприклад "АТБ"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'description',
      label: 'Опис магазину',
      placeholder: 'Наприклад "Один із найбільших..."',
    },
    {
      name: 'url',
      label: 'Веб сайт магазину',
      placeholder: 'Наприклад "https://www.atbmarket.com"',
    },
  ];

  const handleLogoChange = async (event) => {
    const file = event.target.files[0];
    if (file && onUploadLogo) {
      setUploading(true);
      try {
        await onUploadLogo(file);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <>
      {shop?.id && (
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
                shop.logo
                  ? `${BASE_URL.replace('/api/', '')}/images/shops/${shop.logo}`
                  : `${BASE_URL.replace('/api/', '')}/images/noLogo.png`
              }
              alt={shop.logo ? 'Логотип магазину' : 'Немає логотипу'}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
            {shop.logo && (
              <IconButton
                size='small'
                color='error'
                onClick={onRemoveLogo}
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
            {shop?.logo ? 'Оновити логотип' : 'Завантажити логотип'}
            <input
              type='file'
              accept='image/*'
              hidden
              onChange={handleLogoChange}
            />
          </Button>
        </Box>
      )}

      <BaseForm
        initialValues={initialValues}
        validationSchema={PRODUCT_VALIDATION_SCHEME}
        onSubmit={onSubmit}
        fields={fields}
        submitButtonText={shop ? 'Зберегти зміни' : 'Додати магазин'}
      />
    </>
  );
}

export default ShopForm;
