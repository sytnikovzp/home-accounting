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

function RolesPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, totalCount } = await restController.fetchAllRoles({
        page: currentPage,
        limit: pageSize,
      });
      setRoles(data);
      setTotalCount(totalCount);
    } catch (error) {
      console.error('Не вдалося отримати ролі:', error);
      setError('Не вдалося отримати ролі');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleEdit = (role) => {
    console.log('Edit:', role);
  };

  const handleDelete = (role) => {
    setRoleToDelete(role);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (roleToDelete) {
      try {
        await restController.removeRole(roleToDelete.id);
        setDeleteModalOpen(false);
        setRoleToDelete(null);
        await fetchRoles();
      } catch (error) {
        console.error('Помилка при видаленні ролі:', error);
        setDeleteError('Не вдалося видалити роль. Недостатньо прав.');
      }
    }
  };

  if (isLoading) return <Preloader message='Завантаження ролей...' />;
  if (error) return <Error error={error} />;

  return (
    <div>
      <Typography variant='h6'>Ролі</Typography>
      <ListTable
        columns={[
          { field: 'title', headerName: 'Назва ролі', align: 'left' },
          { field: 'description', headerName: 'Опис ролі', align: 'left' },
        ]}
        rows={roles}
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

export default RolesPage;
