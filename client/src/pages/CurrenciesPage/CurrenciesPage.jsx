import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
// ==============================================================
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import DeleteConfirmation from '../../components/DeleteConfirmation/DeleteConfirmation';

function CurrenciesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [currencyToDelete, setCurrencyToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setIsLoading(true);
        const { data, totalCount } = await restController.fetchAllCurrencies({
          page: currentPage,
          limit: pageSize,
        });
        setCurrencies(data);
        setTotalCount(totalCount);
      } catch (error) {
        console.error('Не вдалося отримати валюти:', error);
        setError('Не вдалося отримати валюти');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, [currentPage, pageSize]);

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Сброс на первую страницу
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
          rowsPerPageOptions: [5, 10, 25, 50],
        }}
      />
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default CurrenciesPage;
