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
    isFetching,
    error: fetchError,
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
        isLink: Boolean(product),
        label: 'Товар',
        linkTo: establishment ? `/products/${product?.uuid}` : '',
        value: product?.title || '*Немає даних*',
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
        isLink: Boolean(establishment),
        label: 'Заклад',
        linkTo: establishment ? `/establishments/${establishment?.uuid}` : '',
        value: establishment?.title || '*Немає даних*',
      },
      {
        icon: Person,
        isLink: Boolean(creatorFullName),
        label: 'Автор',
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
        value: creatorFullName,
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
      error={fetchError?.data}
      title='Деталі витрати...'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseViewPage;
