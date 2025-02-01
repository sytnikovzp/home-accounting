import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { pageTitles } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePageTitle from '../../hooks/usePageTitle';
import usePagination from '../../hooks/usePagination';
import { useFetchAllRolesQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import RoleAddPage from './RoleAddPage';
import RoleEditPage from './RoleEditPage';
import RoleRemovePage from './RoleRemovePage';
import RoleViewPage from './RoleViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

const { ROLES_TITLES } = pageTitles;
const ROLES_PAGES = [
  { path: 'add', Component: RoleAddPage },
  { path: 'edit/:uuid', Component: RoleEditPage },
  { path: 'remove/:uuid', Component: RoleRemovePage },
  { path: ':uuid', Component: RoleViewPage },
];

function RolesPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });

  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: rolesData,
    isLoading: isFetching,
    error: fetchError,
  } = useFetchAllRolesQuery({
    page: currentPage,
    limit: pageSize,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const roles = rolesData?.data ?? [];
  const totalCount = rolesData?.totalCount ?? 0;

  usePageTitle(location, ROLES_TITLES);

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    navigate('/roles');
  }, [navigate]);

  const handleAddClick = useCallback(() => {
    handleModalOpen('add');
  }, [handleModalOpen]);

  const handleEdit = useCallback(
    (role) => handleModalOpen('edit', role.uuid),
    [handleModalOpen]
  );

  const handleRemove = useCallback(
    (role) => handleModalOpen('remove', role.uuid),
    [handleModalOpen]
  );

  const showPreloader = useDelayedPreloader(isFetching);

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Ролей користувачів"...' />;
  }

  if (fetchError) {
    return <Error error={fetchError.data.message} />;
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
          Ролі користувачів
        </Typography>
        <Button
          color='success'
          sx={stylesEntityPageButton}
          variant='contained'
          onClick={handleAddClick}
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
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSortModelChange={setSortModel}
      />
      <EntityRoutes
        entityPages={ROLES_PAGES}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default RolesPage;
