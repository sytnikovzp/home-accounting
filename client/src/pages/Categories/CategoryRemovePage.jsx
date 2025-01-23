import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@mui/material';

import {
  selectCategoriesActionError,
  selectCategoriesProcessingAction,
  selectSelectedCategory,
} from '../../store/selectors/categoriesSelectors';
import { clearSelected } from '../../store/slices/categoriesSlice';
import {
  fetchCategories,
  fetchCategoryByUuid,
  removeCategory,
} from '../../store/thunks/categoriesThunks';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function CategoryRemovePage() {
  const { uuid } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const category = useSelector(selectSelectedCategory);
  const isLoading = useSelector(selectCategoriesProcessingAction);
  const error = useSelector(selectCategoriesActionError);

  useEffect(() => {
    if (uuid) {
      dispatch(fetchCategoryByUuid(uuid));
    }
  }, [uuid, dispatch]);

  const handleModalClose = useCallback(() => {
    dispatch(clearSelected());
    navigate('/categories');
  }, [dispatch, navigate]);

  const handleDeleteCategory = async () => {
    try {
      await dispatch(removeCategory({ uuid })).unwrap();
      dispatch(fetchCategories());
      handleModalClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <ModalWindow
      isOpen
      actions={[
        <Button
          key='remove'
          fullWidth
          color='error'
          size='large'
          variant='contained'
          onClick={handleDeleteCategory}
        >
          Видалити
        </Button>,
      ]}
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography sx={stylesDeletePageTypography} variant='body1'>
            Ви впевнені, що хочете видалити категорію «{category?.title}»?
          </Typography>
        )
      }
      error={error}
      title='Видалення категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryRemovePage;
