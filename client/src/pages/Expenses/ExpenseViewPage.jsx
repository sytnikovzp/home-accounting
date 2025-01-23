import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
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

import {
  selectExpensesActionError,
  selectExpensesProcessingAction,
  selectSelectedExpense,
} from '../../store/selectors/expensesSelectors';
import { fetchExpenseByUuid } from '../../store/thunks/expensesThunks';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageBox } from '../../styles';

function ExpenseViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const dispatch = useDispatch();

  const expense = useSelector(selectSelectedExpense);
  const isLoading = useSelector(selectExpensesProcessingAction);
  const error = useSelector(selectExpensesActionError);

  useEffect(() => {
    if (uuid) {
      dispatch(fetchExpenseByUuid(uuid));
    }
  }, [dispatch, uuid]);

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
  } = expense || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  const data = useMemo(
    () => [
      {
        icon: DryCleaning,
        label: 'Товар',
        value: product?.title || '*Немає даних*',
        isLink: Boolean(product),
        linkTo: establishment ? `/products/${product?.uuid}` : '',
      },
      {
        icon: ProductionQuantityLimits,
        label: 'Кількість',
        value: `${quantity || '*Немає даних*'} ${measure?.title || '*Немає даних*'}`,
      },
      {
        icon: AttachMoney,
        label: 'Ціна за одиницю',
        value: `${unitPrice || '*Немає даних*'} ${currency?.code || '*Немає даних*'}`,
      },
      {
        icon: AttachMoney,
        iconColor: 'secondary',
        label: 'Сума',
        value: `${totalPrice || '*Немає даних*'} ${currency?.code || '*Немає даних*'}`,
      },
      {
        icon: Store,
        label: 'Заклад',
        value: establishment?.title || '*Немає даних*',
        isLink: Boolean(establishment),
        linkTo: establishment ? `/establishments/${establishment?.uuid}` : '',
      },
      {
        icon: Person,
        label: 'Автор',
        value: creatorFullName,
        isLink: Boolean(creatorFullName),
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
      },
      { icon: Shop, label: 'Дата витрати', value: date || '*Немає даних*' },
      { icon: CalendarToday, label: 'Створено', value: createdAt },
      { icon: Update, label: 'Редаговано', value: updatedAt },
    ],
    [
      product,
      quantity,
      unitPrice,
      totalPrice,
      establishment,
      measure,
      currency,
      date,
      creatorFullName,
      creatorUuid,
      createdAt,
      updatedAt,
    ]
  );

  return (
    <ModalWindow
      isOpen
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={stylesViewPageBox}>
            <ViewDetails data={data} />
          </Box>
        )
      }
      error={error}
      title='Деталі витрати...'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseViewPage;
