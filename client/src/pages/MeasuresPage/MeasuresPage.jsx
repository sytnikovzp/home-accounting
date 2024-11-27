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

function MeasuresPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [measures, setMeasures] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [measureToDelete, setMeasureToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchMeasures = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, totalCount } = await restController.fetchAllMeasures({
        page: currentPage,
        limit: pageSize,
      });
      setMeasures(data);
      setTotalCount(totalCount);
    } catch (error) {
      console.error('Не вдалося отримати одиниці виміру:', error);
      setError('Не вдалося отримати одиниці');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchMeasures();
  }, [fetchMeasures]);

  const handleEdit = (measure) => {
    console.log('Edit:', measure);
  };

  const handleDelete = (measure) => {
    setMeasureToDelete(measure);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (measureToDelete) {
      try {
        await restController.removeMeasure(measureToDelete.id);
        setDeleteModalOpen(false);
        setMeasureToDelete(null);
        await fetchMeasures();
      } catch (error) {
        console.error('Помилка при видаленні одиниці вімірювання:', error);
        setDeleteError('Не вдалося видалити одиницю. Недостатньо прав.');
      }
    }
  };

  if (isLoading) return <Preloader message='Завантаження одиниць...' />;
  if (error) return <Error error={error} />;

  return (
    <div>
      <Typography variant='h6'>Одиниці виміру</Typography>
      <ListTable
        columns={[
          { field: 'title', headerName: 'Назва одиниці', align: 'left' },
          { field: 'description', headerName: 'Опис одиниці', align: 'left' },
        ]}
        rows={measures}
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

export default MeasuresPage;
