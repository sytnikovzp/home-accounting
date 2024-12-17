import { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';
import {
  Info,
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
import {
  stylesRowContainerStyles,
  stylesViewTextStyles,
} from '../../styles/theme';
// ==============================================================
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

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
    uuid: purchaseUuid,
    product,
    amount,
    price,
    summ,
    shop,
    measure,
    currency,
    date,
    creation,
  } = purchaseToCRUD || {};
  const { creatorUuid, creatorFullName, createdAt, updatedAt } = creation || {};
  const productTitle = product?.title || 'Невідомо';
  const shopTitle = shop?.title || 'Невідомо';
  const measureTitle = measure?.title || 'Невідомо';
  const currencyCode = currency?.code || 'Невідомо';

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
          <Box sx={{ mt: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box sx={stylesRowContainerStyles}>
                <Info color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>UUID:</strong> {purchaseUuid}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <ShoppingCart color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Товар: </strong>
                  <Link
                    component={RouterLink}
                    to={`/products/${product?.uuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {productTitle}
                  </Link>
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <ProductionQuantityLimits color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Кількість:</strong> {amount} {measureTitle}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <AttachMoney color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Ціна за одиницю:</strong> {price} {currencyCode}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <AttachMoney color='secondary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Сума:</strong> {summ} {currencyCode}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Store color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Магазин: </strong>
                  <Link
                    component={RouterLink}
                    to={`/shops/${shop?.uuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {shopTitle}
                  </Link>
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Person color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Автор: </strong>
                  <Link
                    component={RouterLink}
                    to={`/users/${creatorUuid}`}
                    color='primary'
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Shop color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Дата покупки:</strong> {date}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <CalendarToday color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Створено:</strong> {createdAt}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Update color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Редаговано:</strong> {updatedAt}
                </Typography>
              </Box>
            </Box>
          </Box>
        )
      }
      error={errorMessage}
    />
  );
}

export default PurchaseViewPage;
