import { groupByFirstLetter } from '../../../utils/sharedFunctions';
import { PRODUCT_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
import { useFetchAllCategoriesQuery } from '../../../store/services';

import Preloader from '../../Preloader/Preloader';
import BaseForm from '../BaseForm/BaseForm';

function ProductForm({ isLoading, product = null, onSubmit }) {
  const { uuid, title, category } = product ?? {};

  const { data: categoriesData, isLoading: isFetchingCategories } =
    useFetchAllCategoriesQuery({
      page: 1,
      limit: 500,
      sort: 'title',
    });

  const categories = categoriesData?.data ?? [];

  const initialValues = {
    title: title || '',
    category: category?.title || '',
  };

  const fields = [
    {
      name: 'title',
      label: 'Назва товару/послуги',
      placeholder: 'Наприклад "Футболка"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'category',
      label: 'Категорія товару/послуги',
      type: 'autocomplete',
      options: groupByFirstLetter([...categories], 'title', 'title'),
      placeholder: 'Наприклад "Одяг"',
    },
  ];

  if (isFetchingCategories) {
    return <Preloader />;
  }

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      isLoading={isLoading}
      submitButtonText={uuid ? 'Зберегти зміни' : 'Додати товар'}
      validationSchema={PRODUCT_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ProductForm;
