import { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import {
  Info,
  CalendarToday,
  Person,
  Update,
  Description,
} from '@mui/icons-material';
// ==============================================================
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import DetailRow from '../../components/DetailRow/DetailRow';

function MeasureViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const {
    entity: measureToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Measure');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const {
    uuid: measureUuid,
    title,
    description,
    creation,
  } = measureToCRUD || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Деталі одиниці...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DetailRow icon={Info} label='UUID' value={measureUuid} />
              <DetailRow icon={Info} label='Назва' value={title} />
              <DetailRow
                icon={Description}
                label='Опис'
                value={description || '*Дані відсутні*'}
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

export default MeasureViewPage;
