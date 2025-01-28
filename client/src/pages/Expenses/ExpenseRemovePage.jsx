import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import {
  useFetchExpenseByUuidQuery,
  useRemoveExpenseMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function ExpenseRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const { data: expense, isLoading: isFetching } =
    useFetchExpenseByUuidQuery(uuid);

  const [removeExpense, { isLoading: isDeleting, error }] =
    useRemoveExpenseMutation();

  const handleDeleteExpense = useCallback(async () => {
    if (!expense?.uuid) {
      return;
    }
    const result = await removeExpense(expense.uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [expense?.uuid, handleModalClose, removeExpense]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isDeleting}
        size='large'
        variant='contained'
        onClick={handleDeleteExpense}
      >
        Видалити
      </Button>,
    ],
    [isDeleting, handleDeleteExpense]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        Ви впевнені, що хочете видалити витрату «{expense?.product.title}»?
      </Typography>
    );
  }, [isFetching, expense?.product.title]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={error?.data}
      title='Видалення витрати...'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseRemovePage;
