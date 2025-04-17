import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useHasPermission from '../../hooks/useHasPermission';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import { useFetchAllRolesQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import ListTable from '../../components/ListTable/ListTable';

import RoleAddPage from './RoleAddPage';
import RoleEditPage from './RoleEditPage';
import RoleRemovePage from './RoleRemovePage';
import RoleViewPage from './RoleViewPage';

import { stylesEntityPagesBox } from '../../styles';

const ROLES_PAGES = [
  { path: 'add', Component: RoleAddPage },
  { path: 'edit/:uuid', Component: RoleEditPage },
  { path: 'remove/:uuid', Component: RoleRemovePage },
  { path: ':uuid', Component: RoleViewPage },
];

function RolesPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const { hasPermission } = useHasPermission();
  const navigate = useNavigate();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: rolesData,
    isFetching,
    error: fetchError,
  } = useFetchAllRolesQuery({
    page: currentPage,
    limit: pageSize,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const roles = rolesData?.data ?? [];
  const totalCount = rolesData?.totalCount ?? 0;

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    navigate(-1);
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

  return (
    <Container maxWidth='lg' sx={{ py: 2 }}>
      <Box sx={stylesEntityPagesBox}>
        <Typography variant='h6'>Ролі користувачів</Typography>
        {hasPermission('roles', 'add') && (
          <Button
            color='success'
            size='small'
            variant='contained'
            onClick={handleAddClick}
          >
            Додати
          </Button>
        )}
      </Box>
      <ListTable
        fetchError={fetchError}
        isFetching={isFetching}
        linkEntity='roles'
        pagination={{
          currentPage,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          pageSize,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
          totalCount,
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
    </Container>
  );
}

export default RolesPage;
