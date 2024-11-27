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

function ShopsPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shops, setShops] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [shopToDelete, setShopToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchShops = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, totalCount } = await restController.fetchAllShops({
        page: currentPage,
        limit: pageSize,
      });
      setShops(data);
      setTotalCount(totalCount);
    } catch (error) {
      console.error('Не вдалося отримати магазини:', error);
      setError('Не вдалося отримати магазини');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const handleEdit = (shop) => {
    console.log('Edit:', shop);
  };

  const handleDelete = (shop) => {
    setShopToDelete(shop);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (shopToDelete) {
      try {
        await restController.removeShop(shopToDelete.id);
        setDeleteModalOpen(false);
        setShopToDelete(null);
        await fetchShops();
      } catch (error) {
        console.error('Помилка при видаленні магазину:', error);
        setDeleteError('Не вдалося видалити магазин. Недостатньо прав.');
      }
    }
  };

  if (isLoading) return <Preloader message='Завантаження магазинів...' />;
  if (error) return <Error error={error} />;

  return (
    <div>
      <Typography variant='h6'>Магазини</Typography>
      <ListTable
        columns={[
          { field: 'title', headerName: 'Назва магазину', align: 'left' },
          { field: 'url', headerName: 'Посилання', align: 'left' },
          { field: 'logo', headerName: 'Логотип', align: 'left' },
        ]}
        rows={shops}
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

export default ShopsPage;
