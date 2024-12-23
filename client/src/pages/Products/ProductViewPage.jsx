import { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import {
  Info,
  CalendarToday,
  Person,
  Update,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Category,
} from '@mui/icons-material';
// ==============================================================
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import DetailRow from '../../components/DetailRow/DetailRow';

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

  const statusIcon = (() => {
    switch (status) {
      case 'Затверджено':
        return <CheckCircle color='success' />;
      case 'Очікує модерації':
        return <HourglassEmpty color='warning' />;
      case 'Відхилено':
        return <Cancel color='error' />;
      default:
        return null;
    }
  })();

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
          <Box sx={{ mt: 1, mb: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DetailRow icon={Info} label='Назва' value={title} />
              <DetailRow
                icon={() => statusIcon}
                label='Статус'
                value={status}
              />
              <DetailRow
                icon={Category}
                label='Категорія'
                value={
                  <Link
                    component={RouterLink}
                    to={`/categories/${category?.uuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {categoryTitle}
                  </Link>
                }
              />
              <DetailRow
                icon={Person}
                label='Автор'
                value={
                  <Link
                    component={RouterLink}
                    to={`/users/${creatorUuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
                }
              />
              {moderatorFullName && (
                <DetailRow
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
              <DetailRow
                icon={CalendarToday}
                label='Створено'
                value={createdAt}
              />
              <DetailRow icon={Update} label='Редаговано' value={updatedAt} />
            </Box>
          </Box>
        )
      }
      error={errorMessage}
    />
  );
}

export default ProductViewPage;
