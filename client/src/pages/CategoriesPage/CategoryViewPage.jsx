import { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import {
  Info,
  CalendarToday,
  Person,
  Update,
  CheckCircle,
  Cancel,
  HourglassEmpty,
} from '@mui/icons-material';
// ==============================================================
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import DetailRow from '../../components/DetailRow/DetailRow';

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

  const {
    uuid: categoryUuid,
    title,
    status,
    moderation,
    creation,
  } = categoryToCRUD || {};
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
      title='Деталі категорії...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DetailRow icon={Info} label='UUID' value={categoryUuid} />
              <DetailRow icon={Info} label='Назва' value={title} />
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

export default CategoryViewPage;
