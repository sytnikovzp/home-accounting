import { useMemo } from 'react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale/uk';

import { getExpenseFormFields } from '../../../utils/formFieldsHelpers';
import { EXPENSE_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import {
  useFetchAllCurrenciesQuery,
  useFetchAllEstablishmentsQuery,
  useFetchAllMeasuresQuery,
  useFetchAllProductsQuery,
} from '../../../store/services';

import Preloader from '../../Preloader/Preloader';
import BaseForm from '../BaseForm/BaseForm';

function ExpenseForm({ isSubmitting, expense = null, onSubmit }) {
  const {
    product,
    quantity,
    unitPrice,
    establishment,
    measure,
    currency,
    date,
  } = expense ?? {};

  const initialValues = useMemo(
    () => ({
      product: product?.title || '',
      quantity: quantity || '',
      unitPrice: unitPrice || '',
      establishment: establishment?.title || '',
      measure: measure?.title || '',
      currency: currency?.title || 'Українська гривня',
      date: date || format(new Date(), 'dd MMMM yyyy', { locale: uk }),
    }),
    [
      currency?.title,
      date,
      establishment?.title,
      measure?.title,
      product?.title,
      quantity,
      unitPrice,
    ]
  );

  const measuresQuery = useFetchAllMeasuresQuery({
    page: 1,
    limit: 500,
    sort: 'description',
  });
  const currenciesQuery = useFetchAllCurrenciesQuery({
    page: 1,
    limit: 500,
    sort: 'title',
  });
  const establishmentsQuery = useFetchAllEstablishmentsQuery({
    page: 1,
    limit: 500,
    sort: 'title',
  });
  const productsQuery = useFetchAllProductsQuery({
    page: 1,
    limit: 500,
    sort: 'title',
  });

  const renderFields = useMemo(
    () =>
      getExpenseFormFields({
        products: productsQuery.data?.data ?? [],
        establishments: establishmentsQuery.data?.data ?? [],
        measures: measuresQuery.data?.data ?? [],
        currencies: currenciesQuery.data?.data ?? [],
      }),
    [
      productsQuery.data,
      establishmentsQuery.data,
      measuresQuery.data,
      currenciesQuery.data,
    ]
  );

  if (
    measuresQuery.isLoading ||
    currenciesQuery.isLoading ||
    establishmentsQuery.isLoading ||
    productsQuery.isLoading
  ) {
    return <Preloader />;
  }

  return (
    <BaseForm
      fields={renderFields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      layout='expense'
      validationSchema={EXPENSE_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ExpenseForm;
