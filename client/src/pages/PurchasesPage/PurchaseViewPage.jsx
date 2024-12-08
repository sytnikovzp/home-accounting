import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const { id } = useParams();
  const {
    entity: purchaseToCRUD,
    isLoading,
    errorMessage,
    fetchEntityById,
  } = useFetchEntity('Purchase');

  useEffect(() => {
    if (id) fetchEntityById(id);
  }, [id, fetchEntityById]);

  const {
    id: purchaseId,
    product,
    amount,
    price,
    summ,
    shop,
    measure,
    currency,
    creation,
  } = purchaseToCRUD || {};
  const { creatorId, creatorFullName, createdAt, updatedAt } = creation || {};

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
                  <strong>ID:</strong> {purchaseId}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <ShoppingCart color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Товар:</strong> {product}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <ProductionQuantityLimits color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Кількість:</strong> {amount} {measure}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <AttachMoney color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Ціна:</strong> {price} {currency}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <AttachMoney color='secondary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Сума:</strong> {summ} {currency}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Store color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Магазин:</strong> {shop}
                </Typography>
              </Box>
              <Box sx={stylesRowContainerStyles}>
                <Person color='primary' />
                <Typography variant='body1' sx={stylesViewTextStyles}>
                  <strong>Автор: </strong>
                  <Link
                    href={`/users/${creatorId}`}
                    color='primary'
                    underline='hover'
                  >
                    {creatorFullName}
                  </Link>
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
