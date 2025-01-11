import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@mui/material';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

import {
  selectCategoriesError,
  selectCategoriesLoading,
  selectCategoryByUuid,
} from '../../store/selectors/categoriesSelectors';
import {
  deleteCategory,
  fetchCategoryByUuid,
} from '../../store/thunks/categoriesThunks';

import { stylesDeletePageTypography } from '../../styles';

function CategoryDeletePage({ handleModalClose }) {
  const dispatch = useDispatch();
  const { uuid } = useParams();

  const categoryToCRUD = useSelector((state) =>
    selectCategoryByUuid(state, uuid)
  );
  const isLoading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  useEffect(() => {
    if (uuid && !categoryToCRUD) {
      dispatch(fetchCategoryByUuid(uuid));
    }
  }, [uuid, dispatch, categoryToCRUD]);

  const handleDeleteCategory = async () => {
    try {
      await dispatch(deleteCategory(categoryToCRUD.uuid)).unwrap();
      handleModalClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  const renderActions = () => {
    if (error) {
      return (
        <Button
          key='close'
          fullWidth
          color='error'
          size='large'
          variant='contained'
          onClick={handleModalClose}
        >
          Закрити
        </Button>
      );
    }
    return (
      <Button
        key='delete'
        fullWidth
        color='error'
        size='large'
        variant='contained'
        onClick={handleDeleteCategory}
      >
        Видалити
      </Button>
    );
  };

  if (!categoryToCRUD || isLoading) {
    return (
      <CustomModal
        isOpen
        showCloseButton
        actions={
          <Button
            fullWidth
            color='error'
            size='large'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        }
        content={isLoading ? <Preloader /> : null}
        error={error}
        title='Видалення категорії...'
        onClose={handleModalClose}
      />
    );
  }

  return (
    <CustomModal
      isOpen
      showCloseButton
      actions={renderActions()}
      content={
        <Typography sx={stylesDeletePageTypography} variant='body1'>
          Ви впевнені, що хочете видалити категорію «{categoryToCRUD.title}»?
        </Typography>
      }
      error={error}
      title='Видалення категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryDeletePage;
