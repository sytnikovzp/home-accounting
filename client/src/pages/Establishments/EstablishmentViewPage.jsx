import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Avatar, Box, Link } from '@mui/material';
import {
  CalendarToday,
  Cancel,
  CheckCircle,
  Description,
  HourglassEmpty,
  Info,
  Link as LinkIcon,
  Person,
  Update,
} from '@mui/icons-material';

import { BASE_URL } from '../../constants';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetailRow from '../../components/ViewDetailRow/ViewDetailRow';

import {
  stylesViewPageAvatarSize,
  stylesViewPageBox,
  stylesViewPageBoxWithAvatar,
} from '../../styles';

const getStatusIcon = (status) => {
  const icons = {
    Затверджено: <CheckCircle color='success' />,
    'Очікує модерації': <HourglassEmpty color='warning' />,
  };
  return icons[status] || <Cancel color='error' />;
};

function EstablishmentViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const {
    entity: establishmentToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Establishment');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const { title, description, url, logo, status, moderation, creation } =
    establishmentToCRUD || {};

  const { moderatorUuid, moderatorFullName } = moderation || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  const logoSrc = logo
    ? `${BASE_URL.replace('/api/', '')}/images/establishments/${logo}`
    : `${BASE_URL.replace('/api/', '')}/images/noLogo.png`;

  return (
    <CustomModal
      isOpen
      showCloseButton
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={stylesViewPageBox}>
            <Box sx={stylesViewPageBoxWithAvatar}>
              <ViewDetailRow icon={Info} label='Назва' value={title} />
              <Avatar
                alt='Логотип закладу'
                src={logoSrc}
                sx={stylesViewPageAvatarSize}
                variant='rounded'
              />
            </Box>
            {description && (
              <ViewDetailRow
                icon={Description}
                label='Опис'
                value={description}
              />
            )}
            {url && (
              <ViewDetailRow
                icon={LinkIcon}
                label='Посилання'
                value={
                  <Link href={url} rel='noopener noreferrer' target='_blank'>
                    {url}
                  </Link>
                }
              />
            )}
            <ViewDetailRow
              icon={() => getStatusIcon(status)}
              label='Статус'
              value={status}
            />
            <ViewDetailRow
              icon={Person}
              label='Автор'
              value={
                creatorFullName ? (
                  <Link
                    color='primary'
                    component={RouterLink}
                    to={`/users/${creatorUuid}`}
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
                ) : (
                  '*Дані відсутні*'
                )
              }
            />
            {moderatorFullName && (
              <ViewDetailRow
                icon={Person}
                label='Модератор'
                value={
                  <Link
                    color='primary'
                    component={RouterLink}
                    to={`/users/${moderatorUuid}`}
                    underline='hover'
                  >
                    {moderatorFullName}
                  </Link>
                }
              />
            )}
            <ViewDetailRow
              icon={CalendarToday}
              label='Створено'
              value={createdAt}
            />
            <ViewDetailRow icon={Update} label='Редаговано' value={updatedAt} />
          </Box>
        )
      }
      error={errorMessage}
      title='Деталі закладу...'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentViewPage;
