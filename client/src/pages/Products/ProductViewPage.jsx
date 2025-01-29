import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import {
  CalendarToday,
  Category,
  Info,
  Person,
  Update,
} from '@mui/icons-material';

import { useFetchProductByUuidQuery } from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageBox } from '../../styles';

function ProductViewPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: product,
    isLoading: isFetching,
    error,
  } = useFetchProductByUuidQuery(uuid, {
    skip: !uuid,
  });

  const { title, status, moderation, creation, category } = product ?? {};
  const { moderatorUuid, moderatorFullName } = moderation ?? {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation ?? {};

  const data = useMemo(
    () => [
      { icon: Info, label: 'Назва', value: title },
      {
        icon: () => <StatusIcon status={status} />,
        label: 'Статус',
        value: status,
      },
      {
        icon: Category,
        label: 'Категорія',
        value: category?.title || '*Немає даних*',
        isLink: Boolean(category),
        linkTo: category ? `/categories/${category?.uuid}` : '',
      },
      {
        icon: Person,
        label: 'Автор',
        value: creatorFullName,
        isLink: Boolean(creatorFullName),
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
      },
      ...(moderatorFullName
        ? [
            {
              icon: Person,
              label: 'Модератор',
              value: moderatorFullName,
              isLink: Boolean(moderatorFullName),
              linkTo: moderatorFullName ? `/users/${moderatorUuid}` : '',
            },
          ]
        : []),
      { icon: CalendarToday, label: 'Створено', value: createdAt },
      { icon: Update, label: 'Редаговано', value: updatedAt },
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
      title='Деталі товару/послуги...'
      onClose={handleModalClose}
    />
  );
}

export default ProductViewPage;
