import { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import {
  CalendarToday,
  Person,
  Update,
  ProductionQuantityLimits,
  ShoppingCart,
  AttachMoney,
  Store,
  Shop,
} from '@mui/icons-material';
// ==============================================================
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import DetailRow from '../../components/DetailRow/DetailRow';

function PurchaseViewPage({ handleModalClose }) {
  const { uuid } = useParams();
  const {
    entity: purchaseToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Purchase');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const {
    product,
    quantity,
    unitPrice,
    totalPrice,
    shop,
    measure,
    currency,
    date,
    creation,
  } = purchaseToCRUD || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};

  const productTitle = product?.title || '*Дані відсутні*';
  const shopTitle = shop?.title || '*Дані відсутні*';
  const measureTitle = measure?.title || '*Дані відсутні*';
  const currencyCode = currency?.code || '*Дані відсутні*';

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Деталі покупки...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Box sx={{ mt: 1, mb: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DetailRow
                icon={ShoppingCart}
                label='Товар'
                value={
                  <Link
                    component={RouterLink}
                    to={`/products/${product?.uuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {productTitle}
                  </Link>
                }
              />
              <DetailRow
                icon={ProductionQuantityLimits}
                label='Кількість'
                value={`${quantity} ${measureTitle}`}
              />
              <DetailRow
                icon={AttachMoney}
                label='Ціна за одиницю'
                value={`${unitPrice} ${currencyCode}`}
              />
              <DetailRow
                icon={AttachMoney}
                label='Сума'
                value={`${totalPrice} ${currencyCode}`}
                iconColor='secondary'
              />
              <DetailRow
                icon={Store}
                label='Магазин'
                value={
                  <Link
                    component={RouterLink}
                    to={`/shops/${shop?.uuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {shopTitle}
                  </Link>
                }
              />
              <DetailRow
                icon={Person}
                label='Автор'
                value={
                  <Link
                    component={RouterLink}
                    to={`/users/${creatorUuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
                }
              />
              <DetailRow icon={Shop} label='Дата покупки' value={date} />
              <DetailRow
                icon={CalendarToday}
                label='Створено'
                value={createdAt}
              />
              <DetailRow icon={Update} label='Редаговано' value={updatedAt} />
            </Box>
          </Box>
        )
      }
      error={errorMessage}
    />
  );
}

export default PurchaseViewPage;
