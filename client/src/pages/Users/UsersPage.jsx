import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import { DELAY_SHOW_PRELOADER } from '../../constants';
import { uuidPattern } from '../../utils/sharedFunctions';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import UserChangePasswordPage from './UserChangePasswordPage';
import UserEditPage from './UserEditPage';
import UserRemovePage from './UserRemovePage';
import UserViewPage from './UserViewPage';

import { stylesEntityPageBox, stylesEntityPageTypography } from '../../styles';

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
  const location = useLocation();

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/users');
  };

  const handleModalOpen = (mode, uuid = null) => {
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

  const pageTitles = useMemo(
    () => ({
      view: 'Деталі користувача | Моя бухгалтерія',
      edit: 'Редагування користувача | Моя бухгалтерія',
      delete: 'Видалення користувача | Моя бухгалтерія',
      password: 'Зміна паролю | Моя бухгалтерія',
      default: 'Користувачі | Моя бухгалтерія',
    }),
    []
  );

  useEffect(() => {
    const pathKey = Object.keys(pageTitles).find((key) =>
      location.pathname.includes(key)
    );
    const isUuid = uuidPattern.test(location.pathname);
    const isEditOrDelete =
      location.pathname.includes('password') ||
      location.pathname.includes('edit') ||
      location.pathname.includes('delete');
    document.title =
      isUuid && !isEditOrDelete
        ? pageTitles.view
        : pageTitles[pathKey] || pageTitles.default;
  }, [location, pageTitles]);

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
    let timeout = null;
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
          <UserRemovePage
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

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Користувачів"...' />;
  }
  if (errorMessage) {
    return <Error error={errorMessage} />;
  }

  return (
    <>
      <Box
        alignItems='center'
        display='flex'
        flexDirection={stylesEntityPageBox}
        justifyContent='space-between'
        mb={2}
      >
        <Typography component='h2' sx={stylesEntityPageTypography}>
          Користувачі
        </Typography>
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
        onDelete={(user) => handleModalOpen('delete', user.uuid)}
        onEdit={(user) => handleModalOpen('edit', user.uuid)}
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
