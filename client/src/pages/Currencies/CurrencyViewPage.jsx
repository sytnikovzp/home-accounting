import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import {
  CalendarToday,
  Description,
  Info,
  Person,
  Update,
} from '@mui/icons-material';

import { useFetchCurrencyByUuidQuery } from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageBox } from '../../styles';

function CurrencyViewPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: currency,
    isLoading: isFetching,
    error,
  } = useFetchCurrencyByUuidQuery(uuid, {
    skip: !uuid,
  });

  const { title, code, creation } = currency ?? {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation ?? {};

  const data = useMemo(
    () => [
      { icon: Info, label: 'Назва', value: title },
      { icon: Description, label: 'Міжнародний код валюти', value: code },
      {
        icon: Person,
        label: 'Автор',
        value: creatorFullName,
        isLink: Boolean(creatorFullName),
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
      },
      { icon: CalendarToday, label: 'Створено', value: createdAt },
      { icon: Update, label: 'Редаговано', value: updatedAt },
    ],
    [title, code, creatorFullName, creatorUuid, createdAt, updatedAt]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Box sx={stylesViewPageBox}>
        <ViewDetails data={data} />
      </Box>
    );
  }, [data, isFetching]);

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Деталі валюти...'
      onClose={handleModalClose}
    />
  );
}

export default CurrencyViewPage;
