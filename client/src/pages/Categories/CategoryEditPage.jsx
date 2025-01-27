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

  const [editCategory, { error }] = useEditCategoryMutation();

  const handleSubmitCategory = async (values) => {
    const result = await editCategory({
      categoryUuid: uuid,
      title: values.title,
    });
    if (result?.data) {
      handleModalClose();
    }
  };

  return (
    <ModalWindow
      isOpen
      content={
        isFetching ? (
          <Preloader />
        ) : (
          <CategoryForm category={category} onSubmit={handleSubmitCategory} />
        )
      }
      error={error?.data}
      title='Редагування категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryEditPage;
