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

function ProductsPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, totalCount } = await restController.fetchAllProducts({
        page: currentPage,
        limit: pageSize,
      });
      setProducts(data);
      setTotalCount(totalCount);
    } catch (error) {
      console.error('Не вдалося отримати дані про товари:', error);
      setError('Не вдалося отримати дані про товари');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product) => {
    console.log('Edit:', product);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await restController.removeProduct(productToDelete.id);
        setDeleteModalOpen(false);
        setProductToDelete(null);
        await fetchProducts();
      } catch (error) {
        console.error('Помилка при видаленні товару:', error);
        setDeleteError('Не вдалося видалити товар. Недостатньо прав.');
      }
    }
  };

  if (isLoading) return <Preloader message='Завантаження товарів...' />;
  if (error) return <Error error={error} />;

  return (
    <div>
      <Typography variant='h6'>Товари</Typography>
      <ListTable
        columns={[
          { field: 'title', headerName: 'Назва товару', align: 'left' },
          { field: 'category', headerName: 'Категорія', align: 'left' },
        ]}
        rows={products}
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

export default ProductsPage;
