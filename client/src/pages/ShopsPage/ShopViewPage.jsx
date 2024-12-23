import { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Link, Avatar } from '@mui/material';
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
import useFetchEntity from '../../hooks/useFetchEntity';
import { BASE_URL } from '../../constants';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import DetailRow from '../../components/DetailRow/DetailRow';

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

  const { title, description, url, logo, status, moderation, creation } =
    shopToCRUD || {};

  const { moderatorUuid, moderatorFullName } = moderation || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  const statusIcon = (() => {
    switch (status) {
      case 'Затверджено':
        return <CheckCircle color='success' />;
      case 'Очікує модерації':
        return <HourglassEmpty color='warning' />;
      case 'Відхилено':
        return <Cancel color='error' />;
      default:
        return null;
    }
  })();

  const logoSrc = logo
    ? `${BASE_URL.replace('/api/', '')}/images/shops/${logo}`
    : `${BASE_URL.replace('/api/', '')}/images/noLogo.png`;

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
          <Box sx={{ mt: 1, mb: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <DetailRow icon={Info} label='Назва' value={title} />
                <Avatar
                  src={logoSrc}
                  alt='Логотип магазину'
                  variant='rounded'
                  sx={{ width: 50, height: 50 }}
                />
              </Box>
              {description && (
                <DetailRow
                  icon={Description}
                  label='Опис'
                  value={description}
                />
              )}
              {url && (
                <DetailRow
                  icon={LinkIcon}
                  label='Посилання'
                  value={
                    <Link href={url} target='_blank' rel='noopener noreferrer'>
                      {url}
                    </Link>
                  }
                />
              )}
              <DetailRow
                icon={() => statusIcon}
                label='Статус'
                value={status}
              />
              <DetailRow
                icon={Person}
                label='Автор'
                value={
                  <Link
                    component={RouterLink}
                    to={`/users/${creatorUuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
                }
              />
              {moderatorFullName && (
                <DetailRow
                  icon={Person}
                  label='Модератор'
                  value={
                    <Link
                      component={RouterLink}
                      to={`/users/${moderatorUuid}`}
                      color='primary'
                      underline='hover'
                    >
                      {moderatorFullName}
                    </Link>
                  }
                />
              )}
              <DetailRow
                icon={CalendarToday}
                label='Створено'
                value={createdAt}
              />
              <DetailRow icon={Update} label='Редаговано' value={updatedAt} />
            </Box>
          </Box>
        )
      }
      error={errorMessage}
    />
  );
}

export default ShopViewPage;
