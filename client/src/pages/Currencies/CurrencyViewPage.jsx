import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import UpdateIcon from '@mui/icons-material/Update';

import { useFetchCurrencyByUuidQuery } from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

function CurrencyViewPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: currencyData,
    isFetching,
    error: fetchError,
  } = useFetchCurrencyByUuidQuery(uuid, { skip: !uuid });

  const { title, code, creation } = currencyData ?? {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation ?? {};

  const apiError = fetchError?.data;

  const renderDetailsData = useMemo(
    () => [
      { icon: InfoIcon, label: 'Назва', value: title },
      { icon: DescriptionIcon, label: 'Міжнародний код валюти', value: code },
      {
        icon: PersonIcon,
        isLink: Boolean(creatorFullName),
        label: 'Автор',
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
        value: creatorFullName,
      },
      { icon: CalendarTodayIcon, label: 'Створено', value: createdAt },
      { icon: UpdateIcon, label: 'Редаговано', value: updatedAt },
    ],
    [title, code, creatorFullName, creatorUuid, createdAt, updatedAt]
  );

  if (apiError) {
    return (
      <ModalWindow
        isOpen
        showCloseButton
        title={apiError.title}
        onClose={handleModalClose}
      >
        <Alert severity={apiError.severity}>{apiError.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      isFetching={isFetching}
      title='Деталі валюти'
      onClose={handleModalClose}
    >
      <ViewDetails data={renderDetailsData} />
    </ModalWindow>
  );
}

export default CurrencyViewPage;
