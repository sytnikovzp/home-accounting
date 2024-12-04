import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';
import {
  Info,
  CalendarToday,
  Person,
  Update,
  Description,
} from '@mui/icons-material';
// ==============================================================
import {
  stylesRowContainerStyles,
  stylesViewTextStyles,
} from '../../styles/theme';
// ==============================================================
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

function CurrencyViewPage({ handleModalClose }) {
  const { id } = useParams();
  const {
    entity: currencyToCRUD,
    isLoading,
    errorMessage,
    fetchEntityById,
  } = useFetchEntity('Currency');

  useEffect(() => {
    if (id) fetchEntityById(id);
  }, [id, fetchEntityById]);

  const { id: currencyId, title, description, creation } = currencyToCRUD || {};
  const { creatorId, creatorFullName, createdAt, updatedAt } = creation || {};

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Деталі валюти...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box sx={stylesRowContainerStyles}>
                <Info color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>ID:</strong> {currencyId}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Info color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Назва:</strong> {title}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Description color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Опис:</strong> {description || '*Дані відсутні*'}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Person color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Автор:</strong>{' '}
                  <Link
                    href={`/users/${creatorId}`}
                    color='primary'
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <CalendarToday color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Створено:</strong> {createdAt}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Update color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Редаговано:</strong> {updatedAt}
                </Typography>
              </Box>
            </Box>
          </Box>
        )
      }
      error={errorMessage}
    />
  );
}

export default CurrencyViewPage;
