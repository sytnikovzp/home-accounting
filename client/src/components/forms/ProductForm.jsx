import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '@/src/constants';
import { getCategoryField } from '@/src/utils/formFieldsHelpers';
import { groupByFirstLetter } from '@/src/utils/selectHelpers';
import { PRODUCT_VALIDATION_SCHEME } from '@/src/utils/validationSchemes';

import { useFetchAllCategoriesQuery } from '@/src/store/services';

import BaseForm from '@/src/components/forms/BaseForm';
import Preloader from '@/src/components/Preloader';

function ProductForm({ isSubmitting, product = null, onSubmit }) {
  const { title, category } = product ?? {};

  const { data: categoriesData, isFetching } = useFetchAllCategoriesQuery({
    page: 1,
    limit: 500,
    sort: 'title',
  });

  const initialValues = useMemo(
    () => ({
      title: title || '',
      category: category?.title || '',
    }),
    [title, category?.title]
  );

  const categories = useMemo(
    () => categoriesData?.data ?? [],
    [categoriesData?.data]
  );

  const groupedOptions = useMemo(
    () => groupByFirstLetter(categories, 'title', 'title'),
    [categories]
  );

  const renderFields = useMemo(
    () => [
      ...FORM_RENDER_FIELDS.productFields,
      getCategoryField(groupedOptions),
    ],
    [groupedOptions]
  );

  if (isFetching) {
    return <Preloader />;
  }

  return (
    <BaseForm
      fields={renderFields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      validationSchema={PRODUCT_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ProductForm;
