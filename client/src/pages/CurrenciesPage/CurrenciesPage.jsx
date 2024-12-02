import { useState, useEffect, useCallback } from 'react';
import { Typography } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
// ==============================================================
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import DeleteConfirmation from '../../components/DeleteConfirmation/DeleteConfirmation';

function CurrenciesPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currencyToDelete, setCurrencyToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchCurrencies = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, totalCount } = await restController.fetchAllCurrencies({
        page: currentPage,
        limit: pageSize,
      });
      setCurrencies(data);
      setTotalCount(totalCount);
    } catch (error) {
      console.error('Не вдалося отримати дані про валюти:', error);
      setError('Не вдалося отримати дані про валюти');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  const handleEdit = (currency) => {
    console.log('Edit:', currency);
  };

  const handleDelete = (currency) => {
    setCurrencyToDelete(currency);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (currencyToDelete) {
      try {
        await restController.removeCurrency(currencyToDelete.id);
        setDeleteModalOpen(false);
        setCurrencyToDelete(null);
        await fetchCurrencies();
      } catch (error) {
        console.error('Помилка при видаленні валюти:', error);
        setDeleteError('Не вдалося видалити валюту. Недостатньо прав.');
      }
    }
  };

  if (isLoading) return <Preloader message='Завантаження валют...' />;
  if (error) return <Error error={error} />;

  return (
    <div>
      <Typography variant='h6'>Валюти</Typography>
      <ListTable
        columns={[
          { field: 'title', headerName: 'Назва валюти', align: 'left' },
          { field: 'description', headerName: 'Опис валюти', align: 'left' },
        ]}
        rows={currencies}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 10, 25, 50],
        }}
      />
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        error={deleteError}
      />
    </div>
  );
}

export default CurrenciesPage;
