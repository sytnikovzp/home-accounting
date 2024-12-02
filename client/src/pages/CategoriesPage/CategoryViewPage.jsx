import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
// ==============================================================
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

function CategoryViewPage({ handleModalClose }) {
  const { id } = useParams();
  const {
    entity: categoryToCRUD,
    isLoading,
    errorMessage,
    fetchEntityById,
  } = useFetchEntity('Category');

  useEffect(() => {
    if (id) fetchEntityById(id);
  }, [id, fetchEntityById]);

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title={categoryToCRUD?.title}
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box>
            <Typography
              variant='body1'
              sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
            >
              ID: {categoryToCRUD?.id}
            </Typography>
            <Typography
              variant='body1'
              sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
            >
              Назва: {categoryToCRUD?.title}
            </Typography>
            <Typography
              variant='body1'
              sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
            >
              Статус модерації: {categoryToCRUD?.status}
            </Typography>
            <Typography
              variant='body1'
              sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
            >
              ID Модератора: {categoryToCRUD?.reviewedBy}
            </Typography>
            <Typography
              variant='body1'
              sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
            >
              Дата модерації: {categoryToCRUD?.reviewedAt}
            </Typography>
            <Typography
              variant='body1'
              sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
            >
              ID Автора: {categoryToCRUD?.createdBy}
            </Typography>
            <Typography
              variant='body1'
              sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
            >
              Дата створення: {categoryToCRUD?.createdAt}
            </Typography>
            <Typography
              variant='body1'
              sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
            >
              Дата редагування: {categoryToCRUD?.updatedAt}
            </Typography>
          </Box>
        )
      }
      error={errorMessage}
    />
  );
}

export default CategoryViewPage;
