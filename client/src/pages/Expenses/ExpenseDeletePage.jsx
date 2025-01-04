import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function ExpenseDeletePage({
  handleModalClose,
  fetchExpenses,
  crudError,
  setCrudError,
}) {
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
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Видалення витрати...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography variant='body1' sx={stylesDeletePageTypography}>
            Ви впевнені, що хочете видалити витрату «
            {expenseToCRUD?.product.title}»?
          </Typography>
        )
      }
      actions={[
        <Button
          key='delete'
          variant='contained'
          color='error'
          size='large'
          onClick={handleDeleteExpense}
          fullWidth
        >
          Видалити
        </Button>,
      ]}
      error={errorMessage || crudError}
    />
  );
}

export default ExpenseDeletePage;
