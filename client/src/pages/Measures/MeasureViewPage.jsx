import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import UpdateIcon from '@mui/icons-material/Update';

import { useFetchMeasureByUuidQuery } from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

function MeasureViewPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: measureData,
    isFetching,
    error: fetchError,
  } = useFetchMeasureByUuidQuery(uuid, { skip: !uuid });

  const { title, description, creation } = measureData ?? {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation ?? {};

  const apiError = fetchError?.data;

  const renderDetailsData = useMemo(
    () => [
      { icon: InfoIcon, label: 'Назва', value: title },
      { icon: DescriptionIcon, label: 'Опис', value: description },
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
    [title, description, creatorFullName, creatorUuid, createdAt, updatedAt]
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
      title='Деталі одиниці'
      onClose={handleModalClose}
    >
      <ViewDetails data={renderDetailsData} />
    </ModalWindow>
  );
}

export default MeasureViewPage;
