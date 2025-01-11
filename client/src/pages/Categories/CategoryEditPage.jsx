import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

import {
  selectCategoriesError,
  selectCategoriesLoading,
  selectCategoryByUuid,
} from '../../store/selectors/categoriesSelectors';
import {
  editCategory,
  fetchCategoryByUuid,
} from '../../store/thunks/categoriesThunks';

import CustomModal from '../../components/CustomModal/CustomModal';
import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import Preloader from '../../components/Preloader/Preloader';

function CategoryEditPage({ handleModalClose }) {
  const { uuid } = useParams();
  const dispatch = useDispatch();

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

  const handleEditCategory = async (values) => {
    try {
      await dispatch(editCategory({ uuid, title: values.title })).unwrap();
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
        <CategoryForm category={categoryToCRUD} onSubmit={handleEditCategory} />
      }
      error={error}
      title='Редагування категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryEditPage;
