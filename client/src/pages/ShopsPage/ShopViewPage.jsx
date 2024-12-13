import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Link, Avatar } from '@mui/material';
import {
  Info,
  CalendarToday,
  Person,
  Update,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Description,
  Link as LinkIcon,
} from '@mui/icons-material';
// ==============================================================
import {
  stylesRowContainerStyles,
  stylesViewTextStyles,
} from '../../styles/theme';
// ==============================================================
import useFetchEntity from '../../hooks/useFetchEntity';
import { BASE_URL } from '../../constants';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

function ShopViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const {
    entity: shopToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Shop');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const {
    uuid: shopUuid,
    title,
    description,
    url,
    logo,
    status,
    moderation,
    creation,
  } = shopToCRUD || {};
  const { moderatorUuid, moderatorFullName } = moderation || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

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
      title='Деталі магазину...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={stylesRowContainerStyles}>
                  <Info color='primary' />
                  <Typography variant='body1' sx={stylesViewTextStyles}>
                    <strong>UUID:</strong> {shopUuid}
                  </Typography>
                </Box>
                <Avatar
                  src={
                    logo
                      ? `${BASE_URL.replace('/api/', '')}/images/shops/${logo}`
                      : `${BASE_URL.replace('/api/', '')}/images/noLogo.png`
                  }
                  alt='Логотип магазину'
                  variant='rounded'
                  sx={{ width: 50, height: 50 }}
                />
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Info color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Назва:</strong> {title}
                </Typography>
              </Box>
              {description && (
                <Box sx={stylesRowContainerStyles}>
                  <Description color='primary' />
                  <Typography variant='body1' sx={stylesViewTextStyles}>
                    <strong>Опис:</strong> {description}
                  </Typography>
                </Box>
              )}
              {url && (
                <Box sx={stylesRowContainerStyles}>
                  <LinkIcon color='primary' />
                  <Typography variant='body1' sx={stylesViewTextStyles}>
                    <strong>Посилання: </strong>
                    <Link href={url} target='_blank' rel='noopener noreferrer'>
                      {url}
                    </Link>
                  </Typography>
                </Box>
              )}
              <Box sx={stylesRowContainerStyles}>
                {statusIcon}
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Статус:</strong> {status}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Person color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Автор: </strong>
                  <Link
                    href={`/users/${creatorUuid}`}
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
                      href={`/users/${moderatorUuid}`}
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

export default ShopViewPage;
