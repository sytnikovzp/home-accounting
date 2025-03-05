import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import UpdateIcon from '@mui/icons-material/Update';

import { useFetchMeasureByUuidQuery } from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

function MeasureViewPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: measure,
    isFetching,
    error: fetchError,
  } = useFetchMeasureByUuidQuery(uuid, { skip: !uuid });

  const { title, description, creation } = measure ?? {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation ?? {};

  const error = fetchError?.data;

  const data = useMemo(
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

  if (error) {
    return (
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow isOpen title='Деталі одиниці' onClose={handleModalClose}>
      {isFetching ? <Preloader /> : <ViewDetails data={data} />}
    </ModalWindow>
  );
}

export default MeasureViewPage;
