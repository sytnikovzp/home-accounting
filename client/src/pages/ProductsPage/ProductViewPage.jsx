import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';
import {
  Info,
  CalendarToday,
  Person,
  Update,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Category,
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

function ProductViewPage({ handleModalClose }) {
  const { id } = useParams();
  const {
    entity: productToCRUD,
    isLoading,
    errorMessage,
    fetchEntityById,
  } = useFetchEntity('Product');

  useEffect(() => {
    if (id) fetchEntityById(id);
  }, [id, fetchEntityById]);

  const {
    id: productId,
    title,
    status,
    moderation,
    creation,
    category,
  } = productToCRUD || {};
  const { moderatorId, moderatorFullName } = moderation || {};
  const { creatorId, creatorFullName, createdAt, updatedAt } = creation || {};

  let statusIcon;
  if (status === 'Затверджено') {
    statusIcon = <CheckCircle color='success' />;
  } else if (status === 'Очікує модерації') {
    statusIcon = <HourglassEmpty color='warning' />;
  } else if (status === 'Відхилено') {
    statusIcon = <Cancel color='error' />;
  }

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Деталі товару...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box sx={stylesRowContainerStyles}>
                <Info color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>ID:</strong> {productId}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Info color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Назва:</strong> {title}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                {statusIcon}
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Статус:</strong> {status}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Category color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Категорія:</strong> {category}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Person color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Автор: </strong>
                  <Link
                    href={`/users/${creatorId}`}
                    color='primary'
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
                </Typography>
              </Box>
              {moderatorFullName && (
                <Box sx={stylesRowContainerStyles}>
                  <Person color='primary' />
                  <Typography variant='body1' sx={stylesViewTextStyles}>
                    <strong>Модератор: </strong>
                    <Link
                      href={`/users/${moderatorId}`}
                      color='primary'
                      underline='hover'
                    >
                      {moderatorFullName}
                    </Link>
                  </Typography>
                </Box>
              )}
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

export default ProductViewPage;
