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

function CurrencyViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const {
    entity: currencyToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Currency');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const { title, code, creation } = currencyToCRUD || {};
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
              label='Міжнародний код валюти'
              value={code}
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
      title='Деталі валюти...'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyViewPage;
