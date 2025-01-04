import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import {
  AttachMoney,
  CalendarToday,
  DryCleaning,
  Person,
  ProductionQuantityLimits,
  Shop,
  Store,
  Update,
} from '@mui/icons-material';

import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetailRow from '../../components/ViewDetailRow/ViewDetailRow';

import { stylesViewPageBox } from '../../styles';

function ExpenseViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const {
    entity: expenseToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Expense');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const {
    product,
    quantity,
    unitPrice,
    totalPrice,
    establishment,
    measure,
    currency,
    date,
    creation,
  } = expenseToCRUD || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  const productTitle = product?.title || '*Дані відсутні*';
  const establishmentTitle = establishment?.title || '*Дані відсутні*';
  const measureTitle = measure?.title || '*Дані відсутні*';
  const currencyCode = currency?.code || '*Дані відсутні*';

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Деталі витрати...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={stylesViewPageBox}>
            <ViewDetailRow
              icon={DryCleaning}
              label='Товар'
              value={
                productTitle ? (
                  <Link
                    component={RouterLink}
                    to={`/products/${product?.uuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {productTitle}
                  </Link>
                ) : (
                  '*Дані відсутні*'
                )
              }
            />
            <ViewDetailRow
              icon={ProductionQuantityLimits}
              label='Кількість'
              value={`${quantity} ${measureTitle}`}
            />
            <ViewDetailRow
              icon={AttachMoney}
              label='Ціна за одиницю'
              value={`${unitPrice} ${currencyCode}`}
            />
            <ViewDetailRow
              icon={AttachMoney}
              label='Сума'
              value={`${totalPrice} ${currencyCode}`}
              iconColor='secondary'
            />
            <ViewDetailRow
              icon={Store}
              label='Заклад'
              value={
                establishmentTitle ? (
                  <Link
                    component={RouterLink}
                    to={`/establishments/${establishment?.uuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {establishmentTitle}
                  </Link>
                ) : (
                  '*Дані відсутні*'
                )
              }
            />
            <ViewDetailRow
              icon={Person}
              label='Автор'
              value={
                creatorFullName ? (
                  <Link
                    component={RouterLink}
                    to={`/users/${creatorUuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
                ) : (
                  '*Дані відсутні*'
                )
              }
            />
            <ViewDetailRow icon={Shop} label='Дата витрати' value={date} />
            <ViewDetailRow
              icon={CalendarToday}
              label='Створено'
              value={createdAt}
            />
            <ViewDetailRow icon={Update} label='Редаговано' value={updatedAt} />
          </Box>
        )
      }
      error={errorMessage}
    />
  );
}

export default ExpenseViewPage;
