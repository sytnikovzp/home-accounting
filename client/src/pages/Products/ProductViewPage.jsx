import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import {
  CalendarToday,
  Cancel,
  Category,
  CheckCircle,
  HourglassEmpty,
  Info,
  Person,
  Update,
} from '@mui/icons-material';

import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetailRow from '../../components/ViewDetailRow/ViewDetailRow';

import { stylesViewPageBox } from '../../styles';

const getStatusIcon = (status) => {
  const icons = {
    Затверджено: <CheckCircle color='success' />,
    'Очікує модерації': <HourglassEmpty color='warning' />,
  };
  return icons[status] || <Cancel color='error' />;
};

function ProductViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const {
    entity: productToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Product');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const { title, status, moderation, creation, category } = productToCRUD || {};

  const { moderatorUuid, moderatorFullName } = moderation || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};
  const categoryTitle = category?.title || '*Дані відсутні*';

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Деталі товару...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={stylesViewPageBox}>
            <ViewDetailRow icon={Info} label='Назва' value={title} />
            <ViewDetailRow
              icon={() => getStatusIcon(status)}
              label='Статус'
              value={status}
            />
            <ViewDetailRow
              icon={Category}
              label='Категорія'
              value={
                categoryTitle ? (
                  <Link
                    component={RouterLink}
                    to={`/categories/${category?.uuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {categoryTitle}
                  </Link>
                ) : (
                  '*Дані відсутні*'
                )
              }
            />
            <ViewDetailRow
              icon={Person}
              label='Автор'
              value={
                creatorFullName ? (
                  <Link
                    component={RouterLink}
                    to={`/users/${creatorUuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
                ) : (
                  '*Дані відсутні*'
                )
              }
            />
            {moderatorFullName && (
              <ViewDetailRow
                icon={Person}
                label='Модератор'
                value={
                  <Link
                    component={RouterLink}
                    to={`/users/${moderatorUuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {moderatorFullName}
                  </Link>
                }
              />
            )}
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
    />
  );
}

export default ProductViewPage;
