import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DryCleaningIcon from '@mui/icons-material/DryCleaning';
import PersonIcon from '@mui/icons-material/Person';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ShopIcon from '@mui/icons-material/Shop';
import StoreIcon from '@mui/icons-material/Store';
import UpdateIcon from '@mui/icons-material/Update';

import { useFetchExpenseByUuidQuery } from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';
import ViewDetails from '../../components/ViewDetails/ViewDetails';

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

  const error = fetchError?.data;

  const data = useMemo(
    () => [
      {
        icon: DryCleaningIcon,
        isLink: Boolean(product),
        label: 'Товар',
        linkTo: establishment ? `/products/${product?.uuid}` : '',
        value: product?.title || '*Немає даних*',
      },
      {
        icon: ProductionQuantityLimitsIcon,
        label: 'Кількість',
        value: `${quantity || '*Немає даних*'} ${measure?.title || '*Немає даних*'}`,
      },
      {
        icon: AttachMoneyIcon,
        label: 'Вартість за одиницю',
        value: `${unitPrice || '*Немає даних*'} ${currency?.code || '*Немає даних*'}`,
      },
      {
        icon: AttachMoneyIcon,
        iconColor: 'secondary',
        label: 'Сума',
        value: `${totalPrice || '*Немає даних*'} ${currency?.code || '*Немає даних*'}`,
      },
      {
        icon: StoreIcon,
        isLink: Boolean(establishment),
        label: 'Заклад',
        linkTo: establishment ? `/establishments/${establishment?.uuid}` : '',
        value: establishment?.title || '*Немає даних*',
      },
      {
        icon: PersonIcon,
        isLink: Boolean(creatorFullName),
        label: 'Автор',
        linkTo: creatorFullName ? `/users/${creatorUuid}` : '',
        value: creatorFullName,
      },
      { icon: ShopIcon, label: 'Дата витрати', value: date || '*Немає даних*' },
      { icon: CalendarTodayIcon, label: 'Створено', value: createdAt },
      { icon: UpdateIcon, label: 'Редаговано', value: updatedAt },
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

  if (error) {
    return (
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow isOpen title='Деталі витрати' onClose={handleModalClose}>
      {isFetching ? <Preloader /> : <ViewDetails data={data} />}
    </ModalWindow>
  );
}

export default ExpenseViewPage;
