import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import UpdateIcon from '@mui/icons-material/Update';

import { useFetchMeasureByUuidQuery } from '../../store/services';

import EntityViewModal from '../../components/ModalWindow/EntityViewModal';

function MeasureViewPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: measure,
    isFetching,
    error: fetchError,
  } = useFetchMeasureByUuidQuery(uuid, { skip: !uuid });

  const { title, description, creation } = measure ?? {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation ?? {};

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

  return (
    <EntityViewModal
      data={data}
      error={fetchError}
      isFetching={isFetching}
      title='Деталі одиниці'
      onClose={handleModalClose}
    />
  );
}

export default MeasureViewPage;
