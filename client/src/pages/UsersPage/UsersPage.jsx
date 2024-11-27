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

function UsersPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, totalCount } = await restController.fetchAllUsers({
        page: currentPage,
        limit: pageSize,
      });
      setUsers(data);
      setTotalCount(totalCount);
    } catch (error) {
      console.error('Не вдалося отримати користувачів:', error);
      setError('Не вдалося отримати користувачів');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user) => {
    console.log('Edit:', user);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await restController.removeUser(userToDelete.id);
        setDeleteModalOpen(false);
        setUserToDelete(null);
        await fetchUsers();
      } catch (error) {
        console.error('Помилка при видаленні користувача:', error);
        setDeleteError('Не вдалося видалити користувача. Недостатньо прав.');
      }
    }
  };

  if (isLoading) return <Preloader message='Завантаження користувачів...' />;
  if (error) return <Error error={error} />;

  return (
    <div>
      <Typography variant='h6'>Користувачі</Typography>
      <ListTable
        columns={[
          { field: 'fullName', headerName: 'Повне імʼя', align: 'left' },
          { field: 'role', headerName: 'Роль', align: 'left' },
          { field: 'photo', headerName: 'Фото', align: 'left' },
        ]}
        rows={users}
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

export default UsersPage;
