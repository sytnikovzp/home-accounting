import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import UpdateIcon from '@mui/icons-material/Update';

import { useFetchProductByUuidQuery } from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

function ProductViewPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: product,
    isFetching,
    error: fetchError,
  } = useFetchProductByUuidQuery(uuid, { skip: !uuid });

  const { title, status, moderation, creation, category } = product ?? {};
  const { moderatorUuid, moderatorFullName } = moderation ?? {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation ?? {};

  const error = fetchError?.data;

  const data = useMemo(
    () => [
      { icon: InfoIcon, label: 'Назва', value: title },
      {
        icon: () => <StatusIcon status={status} />,
        label: 'Статус',
        value: status,
      },
      {
        icon: CategoryIcon,
        isLink: Boolean(category?.title),
        label: 'Категорія',
        linkTo: category ? `/categories/${category?.uuid}` : '',
        value: category?.title || '*Немає даних*',
      },
      {
        icon: PersonIcon,
        isLink: Boolean(creatorFullName),
        label: 'Автор',
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
        value: creatorFullName,
      },
      ...(moderatorFullName
        ? [
            {
              icon: PersonIcon,
              isLink: Boolean(moderatorFullName),
              label: 'Модератор',
              linkTo: moderatorFullName ? `/users/${moderatorUuid}` : '',
              value: moderatorFullName,
            },
          ]
        : []),
      { icon: CalendarTodayIcon, label: 'Створено', value: createdAt },
      { icon: UpdateIcon, label: 'Редаговано', value: updatedAt },
    ],
    [
      title,
      status,
      category,
      creatorFullName,
      creatorUuid,
      moderatorFullName,
      moderatorUuid,
      createdAt,
      updatedAt,
    ]
  );

  if (error) {
    return (
      <ModalWindow
        isOpen
        actionsOnCenter={
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        }
        title={error.title}
        onClose={handleModalClose}
      >
        <Alert severity={error.severity}>{error.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      isFetching={isFetching}
      title='Деталі товару/послуги'
      onClose={handleModalClose}
    >
      <ViewDetails data={data} />
    </ModalWindow>
  );
}

export default ProductViewPage;
