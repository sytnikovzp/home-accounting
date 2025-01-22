import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function ExpenseRemovePage({
  handleModalClose,
  fetchExpenses,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: expenseToCRUD,
    isLoading,
    error,
    fetchEntityByUuid,
  } = useFetchEntity('Expense');

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid]);

  const handleDeleteExpense = async () => {
    try {
      await restController.removeExpense(expenseToCRUD.uuid);
      handleModalClose();
      fetchExpenses();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <ModalWindow
      isOpen
      showCloseButton
      actions={[
        <Button
          key='remove'
          fullWidth
          color='error'
          size='large'
          variant='contained'
          onClick={handleDeleteExpense}
        >
          Видалити
        </Button>,
      ]}
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography sx={stylesDeletePageTypography} variant='body1'>
            Ви впевнені, що хочете видалити витрату «
            {expenseToCRUD?.product.title}»?
          </Typography>
        )
      }
      error={error || crudError}
      title='Видалення витрати...'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseRemovePage;
