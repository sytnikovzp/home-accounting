import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import {
  CalendarToday,
  Description,
  Info,
  Person,
  Update,
} from '@mui/icons-material';

import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetailRow from '../../components/ViewDetailRow/ViewDetailRow';

import { stylesViewPageBox } from '../../styles';

function MeasureViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const {
    entity: measureToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Measure');

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid]);

  const { title, description, creation } = measureToCRUD || {};
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
              icon={Description}
              label='Опис'
              value={description || '*Немає даних*'}
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
      title='Деталі одиниці...'
      onClose={handleModalClose}
    />
  );
}

export default MeasureViewPage;
