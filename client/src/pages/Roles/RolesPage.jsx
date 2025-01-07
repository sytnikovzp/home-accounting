import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { DELAY_SHOW_PRELOADER } from '../../constants';
import { uuidPattern } from '../../utils/sharedFunctions';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import RoleAddPage from './RoleAddPage';
import RoleDeletePage from './RoleDeletePage';
import RoleEditPage from './RoleEditPage';
import RoleViewPage from './RoleViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

function RolesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();
  const location = useLocation();

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/roles');
  };

  const handleModalOpen = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        sort: sortModel.field,
        order: sortModel.order,
      };
      const { data, totalCount } = await restController.fetchAllRoles(params);
      setRoles(data || []);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortModel]);

  const pageTitles = useMemo(
    () => ({
      view: 'Деталі ролі | Моя бухгалтерія',
      add: 'Додавання ролі | Моя бухгалтерія',
      edit: 'Редагування ролі | Моя бухгалтерія',
      delete: 'Видалення ролі | Моя бухгалтерія',
      default: 'Ролі користувачів | Моя бухгалтерія',
    }),
    []
  );

  useEffect(() => {
    const pathKey = Object.keys(pageTitles).find((key) =>
      location.pathname.includes(key)
    );
    const isUuid = uuidPattern.test(location.pathname);
    const isEditOrDelete =
      location.pathname.includes('edit') ||
      location.pathname.includes('delete');
    document.title =
      isUuid && !isEditOrDelete
        ? pageTitles.view
        : pageTitles[pathKey] || pageTitles.default;
  }, [location, pageTitles]);

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data } = await restController.fetchAllPermissions();
      setPermissionsList(data);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

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
          <RoleAddPage
            crudError={crudError}
            fetchRoles={fetchRoles}
            handleModalClose={handleModalClose}
            permissionsList={permissionsList}
            setCrudError={setCrudError}
          />
        }
        path='add'
      />
      <Route
        element={
          <RoleEditPage
            crudError={crudError}
            fetchRoles={fetchRoles}
            handleModalClose={handleModalClose}
            permissionsList={permissionsList}
            setCrudError={setCrudError}
          />
        }
        path='edit/:uuid'
      />
      <Route
        element={
          <RoleDeletePage
            crudError={crudError}
            fetchRoles={fetchRoles}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='delete/:uuid'
      />
      <Route
        element={<RoleViewPage handleModalClose={handleModalClose} />}
        path=':uuid'
      />
    </Routes>
  );

  if (showPreloader)
    return <Preloader message='Завантаження списку "Ролей користувачів"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

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
          Ролі користувачів
        </Typography>
        <Button
          color='success'
          sx={stylesEntityPageButton}
          variant='contained'
          onClick={() => handleModalOpen('add')}
        >
          Додати роль
        </Button>
      </Box>
      <ListTable
        columns={[{ field: 'title', headerName: 'Назва ролі', align: 'left' }]}
        linkEntity='roles'
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
        }}
        rows={roles}
        sortModel={sortModel}
        onDelete={(role) => handleModalOpen('delete', role.uuid)}
        onEdit={(role) => handleModalOpen('edit', role.uuid)}
        onSortModelChange={setSortModel}
      />
      {renderRoutes()}
    </>
  );
}

export default RolesPage;
