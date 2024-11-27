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

function PurchasesPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchPurchases = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, totalCount } = await restController.fetchAllPurchases({
        page: currentPage,
        limit: pageSize,
      });
      setPurchases(data);
      setTotalCount(totalCount);
    } catch (error) {
      console.error('Не вдалося отримати закупівлі:', error);
      setError('Не вдалося отримати закупівлі');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleEdit = (purchase) => {
    console.log('Edit:', purchase);
  };

  const handleDelete = (purchase) => {
    setPurchaseToDelete(purchase);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (purchaseToDelete) {
      try {
        await restController.removePurchase(purchaseToDelete.id);
        setDeleteModalOpen(false);
        setPurchaseToDelete(null);
        await fetchPurchases();
      } catch (error) {
        console.error('Помилка при видаленні закупівлі:', error);
        setDeleteError('Не вдалося видалити закупівлю. Недостатньо прав.');
      }
    }
  };

  if (isLoading) return <Preloader message='Завантаження закупівель...' />;
  if (error) return <Error error={error} />;

  return (
    <div>
      <Typography variant='h6'>Закупівлі</Typography>
      <ListTable
        columns={[
          { field: 'product', headerName: 'Продукт', align: 'left' },
          { field: 'amount', headerName: 'Кількість', align: 'left' },
          { field: 'measure', headerName: 'Одиниця виміру', align: 'left' },
          { field: 'price', headerName: 'Ціна', align: 'left' },
          { field: 'summ', headerName: 'Сума', align: 'left' },
          { field: 'currency', headerName: 'Валюта', align: 'left' },
          { field: 'shop', headerName: 'Магазин', align: 'left' },
        ]}
        rows={purchases}
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

export default PurchasesPage;
