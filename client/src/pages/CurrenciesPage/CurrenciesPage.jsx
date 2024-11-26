import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
// ==============================================================
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import DeleteConfirmation from '../../components/DeleteConfirmation/DeleteConfirmation';

const CurrenciesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [currencyToDelete, setCurrencyToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await restController.fetchAllCurrencies();
        setCurrencies(data);
      } catch (error) {
        console.error('Не вдалося отримати валюти:', error);
        setError('Не вдалося отримати валюти');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const handleEdit = (currency) => {
    console.log('Edit:', currency);
  };

  const handleDelete = (currency) => {
    setCurrencyToDelete(currency);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (currencyToDelete) {
      try {
        await restController.removeCurrency(currencyToDelete.id);
        console.log('Валюта успішно видалена:', currencyToDelete);
        setDeleteModalOpen(false);
        setCurrencyToDelete(null);
        setCurrencies(
          currencies.filter((currency) => currency.id !== currencyToDelete.id)
        );
      } catch (error) {
        console.error('Помилка при видаленні валюти:', error);
      }
    }
  };

  if (isLoading) return <Preloader />;
  if (error) return <Error error={error} />;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant='h6'>Валюти</Typography>
      <ListTable
        columns={[{ field: 'title', headerName: 'Назва', align: 'center' }]}
        rows={currencies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CurrenciesPage;
