import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import {
  CalendarToday,
  Cancel,
  CheckCircle,
  HourglassEmpty,
  Info,
  Person,
  Update,
} from '@mui/icons-material';

import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetailRow from '../../components/ViewDetailRow/ViewDetailRow';

import { stylesViewPageBox } from '../../styles';

const getStatusIcon = (status) => {
  const icons = {
    Затверджено: <CheckCircle color='success' />,
    'Очікує модерації': <HourglassEmpty color='warning' />,
  };
  return icons[status] || <Cancel color='error' />;
};

function CategoryViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const {
    entity: categoryToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Category');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const { title, status, moderation, creation } = categoryToCRUD || {};
  const { moderatorUuid, moderatorFullName } = moderation || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  return (
    <CustomModal
      isOpen
      showCloseButton
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={stylesViewPageBox}>
            <ViewDetailRow icon={Info} label='Назва' value={title} />
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
                  '*Немає даних*'
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
      title='Деталі категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryViewPage;
