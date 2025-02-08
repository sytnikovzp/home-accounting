import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';

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
        label: 'Ціна за одиницю',
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
