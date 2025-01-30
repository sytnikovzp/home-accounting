import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
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

import { useFetchExpenseByUuidQuery } from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

import { stylesViewPageBox } from '../../styles';

function ExpenseViewPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: expense,
    isLoading: isFetching,
    error,
  } = useFetchExpenseByUuidQuery(uuid, { skip: !uuid });

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
  } = expense ?? {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation ?? {};

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

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Box sx={stylesViewPageBox}>
        <ViewDetails data={data} />
      </Box>
    );
  }, [data, isFetching]);

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Деталі витрати...'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseViewPage;
