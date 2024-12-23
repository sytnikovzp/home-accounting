import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Typography, Box } from '@mui/material';
// ==============================================================
import { DELAY_SHOW_PRELOADER } from '../../constants';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
// ==============================================================
import UserEditPage from './UserEditPage';
import UserPasswordPage from './UserPasswordPage';
import UserDeletePage from './UserDeletePage';
import UserViewPage from './UserViewPage';
// ==============================================================
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';

function UsersPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState('all');
  const [sortModel, setSortModel] = useState({
    field: 'fullName',
    order: 'asc',
  });
  const [crudError, setCrudError] = useState(null);

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/users');
  };

  const openModal = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        emailVerificationStatus,
        sort: sortModel.field,
        order: sortModel.order,
      };
      const { data, totalCount } = await restController.fetchAllUsers(params);
      setUsers(data || []);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, emailVerificationStatus, sortModel]);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: 1,
        limit: 500,
      };
      const { data } = await restController.fetchAllRoles(params);
      setRoles(data || []);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  useEffect(() => {
    let timeout;
    if (isLoading) {
      timeout = setTimeout(() => setShowPreloader(true), DELAY_SHOW_PRELOADER);
    } else {
      setShowPreloader(false);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const renderRoutes = () => (
    <Routes>
      <Route
        path='edit/:uuid'
        element={
          <UserEditPage
            handleModalClose={handleModalClose}
            fetchUsers={fetchUsers}
            roles={roles}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='password/:uuid'
        element={
          <UserPasswordPage
            handleModalClose={handleModalClose}
            fetchUsers={fetchUsers}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='delete/:uuid'
        element={
          <UserDeletePage
            handleModalClose={handleModalClose}
            fetchUsers={fetchUsers}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path=':uuid'
        element={<UserViewPage handleModalClose={handleModalClose} />}
      />
    </Routes>
  );

  if (showPreloader)
    return <Preloader message='Завантаження списку "Користувачів"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Користувачі</Typography>
      </Box>
      <ListTable
        columns={[
          { field: 'photo', headerName: 'Фото', align: 'center' },
          { field: 'fullName', headerName: 'Повне ім`я', align: 'left' },
        ]}
        rows={users}
        onEdit={(user) => openModal('edit', user.uuid)}
        onDelete={(user) => openModal('delete', user.uuid)}
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 10, 25, 50],
        }}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        selectedStatus={emailVerificationStatus}
        onStatusChange={(event) =>
          setEmailVerificationStatus(event.target.value)
        }
        showStatusDropdown
        usersPage
        linkEntity='users'
      />
      {renderRoutes()}
    </>
  );
}

export default UsersPage;
