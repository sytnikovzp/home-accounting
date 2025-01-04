import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import { DELAY_SHOW_PRELOADER } from '../../constants';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import UserChangePasswordPage from './UserChangePasswordPage';
import UserDeletePage from './UserDeletePage';
import UserEditPage from './UserEditPage';
import UserViewPage from './UserViewPage';

function UsersPage({ currentUser, setIsAuthenticated }) {
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

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

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
      setErrorMessage(error.response.data);
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
      setErrorMessage(error.response.data);
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
        element={
          <UserEditPage
            crudError={crudError}
            fetchUsers={fetchUsers}
            handleModalClose={handleModalClose}
            roles={roles}
            setCrudError={setCrudError}
          />
        }
        path='edit/:uuid'
      />
      <Route
        element={
          <UserChangePasswordPage
            crudError={crudError}
            fetchUsers={fetchUsers}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='password/:uuid'
      />
      <Route
        element={
          <UserDeletePage
            crudError={crudError}
            currentUser={currentUser}
            fetchUsers={fetchUsers}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
            setIsAuthenticated={setIsAuthenticated}
          />
        }
        path='delete/:uuid'
      />
      <Route
        element={<UserViewPage handleModalClose={handleModalClose} />}
        path=':uuid'
      />
    </Routes>
  );

  if (showPreloader)
    return <Preloader message='Завантаження списку "Користувачів"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <>
      <Box
        alignItems='center'
        display='flex'
        justifyContent='space-between'
        mb={2}
      >
        <Typography variant='h6'>Користувачі</Typography>
      </Box>
      <ListTable
        showStatusDropdown
        usersPage
        columns={[
          { field: 'photo', headerName: 'Фото', align: 'center' },
          { field: 'fullName', headerName: 'Повне ім`я', align: 'left' },
        ]}
        linkEntity='users'
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
        }}
        rows={users}
        selectedStatus={emailVerificationStatus}
        sortModel={sortModel}
        onDelete={(user) => openModal('delete', user.uuid)}
        onEdit={(user) => openModal('edit', user.uuid)}
        onSortModelChange={setSortModel}
        onStatusChange={(event) =>
          setEmailVerificationStatus(event.target.value)
        }
      />
      {renderRoutes()}
    </>
  );
}

export default UsersPage;
