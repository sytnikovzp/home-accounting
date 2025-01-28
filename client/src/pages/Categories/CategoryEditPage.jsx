import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEditCategoryMutation,
  useFetchCategoryByUuidQuery,
} from '../../store/services';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function CategoryEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const { data: category, isLoading: isFetching } =
    useFetchCategoryByUuidQuery(uuid);

  const [editCategory, { isLoading, error }] = useEditCategoryMutation();

  const handleSubmitCategory = useCallback(
    async (values) => {
      const result = await editCategory({
        categoryUuid: uuid,
        title: values.title,
      });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editCategory, uuid, handleModalClose]
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <CategoryForm
      category={category}
      isLoading={isLoading}
      onSubmit={handleSubmitCategory}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Редагування категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryEditPage;
