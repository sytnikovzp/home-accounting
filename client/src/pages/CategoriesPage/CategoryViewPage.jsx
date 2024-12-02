import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid2, Typography } from '@mui/material';
import { Info, CalendarToday, Person, Update } from '@mui/icons-material';
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
      title='Деталі категорії...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Grid2 container spacing={2}>
              <Grid2 xs={12} sm={6}>
                <Info color='primary' sx={{ verticalAlign: 'middle', mr: 1 }} />
                <Typography variant='body1' component='span'>
                  <strong>ID:</strong> {categoryToCRUD?.id}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <Info color='primary' sx={{ verticalAlign: 'middle', mr: 1 }} />
                <Typography variant='body1' component='span'>
                  <strong>Назва:</strong> {categoryToCRUD?.title}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <Info color='primary' sx={{ verticalAlign: 'middle', mr: 1 }} />
                <Typography variant='body1' component='span'>
                  <strong>Статус:</strong> {categoryToCRUD?.status}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <Person
                  color='primary'
                  sx={{ verticalAlign: 'middle', mr: 1 }}
                />
                <Typography variant='body1' component='span'>
                  <strong>Модератор: </strong>
                  {categoryToCRUD?.moderatorId || 'Дані відсутні'}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <Person
                  color='primary'
                  sx={{ verticalAlign: 'middle', mr: 1 }}
                />
                <Typography variant='body1' component='span'>
                  <strong>Автор:</strong> {categoryToCRUD?.creatorId}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <CalendarToday
                  color='primary'
                  sx={{ verticalAlign: 'middle', mr: 1 }}
                />
                <Typography variant='body1' component='span'>
                  <strong>Створено:</strong> {categoryToCRUD?.createdAt}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <Update
                  color='primary'
                  sx={{ verticalAlign: 'middle', mr: 1 }}
                />
                <Typography variant='body1' component='span'>
                  <strong>Редаговано:</strong> {categoryToCRUD?.updatedAt}
                </Typography>
              </Grid2>
            </Grid2>
          </Box>
        )
      }
      error={errorMessage}
    />
  );
}

export default CategoryViewPage;
