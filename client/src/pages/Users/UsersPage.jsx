import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import { useFetchAllUsersQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import ListTable from '../../components/ListTable/ListTable';

import UserChangePasswordPage from './UserChangePasswordPage';
import UserEditPage from './UserEditPage';
import UserRemovePage from './UserRemovePage';
import UserViewPage from './UserViewPage';

import { stylesEntityContainerSx, stylesEntityPagesBox } from '../../styles';

const USERS_PAGES = [
  { path: 'password/:uuid', Component: UserChangePasswordPage },
  { path: 'edit/:uuid', Component: UserEditPage },
  { path: 'remove/:uuid', Component: UserRemovePage },
  { path: ':uuid', Component: UserViewPage },
];

function UsersPage() {
  const [sortModel, setSortModel] = useState({
    field: 'fullName',
    order: 'asc',
  });
  const [emailConfirm, setEmailConfirm] = useState('all');
  const navigate = useNavigate();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: usersData,
    isFetching,
    error: fetchError,
  } = useFetchAllUsersQuery({
    page: currentPage,
    limit: pageSize,
    emailConfirm,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const users = usersData?.data ?? [];
  const totalCount = usersData?.totalCount ?? 0;

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (user) => handleModalOpen('edit', user.uuid),
    [handleModalOpen]
  );

  const handleRemove = useCallback(
    (user) => handleModalOpen('remove', user.uuid),
    [handleModalOpen]
  );

  const handleStatusChange = useCallback((newStatus) => {
    setEmailConfirm(newStatus);
  }, []);

  const paginationConfig = useMemo(
    () => ({
      currentPage,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
      pageSize,
      rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
      totalCount,
    }),
    [
      currentPage,
      handlePageChange,
      handleRowsPerPageChange,
      pageSize,
      itemsPerPage,
      totalCount,
    ]
  );

  return (
    <Container maxWidth='lg' sx={stylesEntityContainerSx}>
      <Box sx={stylesEntityPagesBox}>
        <Typography variant='h6'>Користувачі</Typography>
      </Box>
      <ListTable
        showStatusDropdown
        fetchError={fetchError}
        isFetching={isFetching}
        linkEntity='users'
        pagination={paginationConfig}
        rows={users}
        selectedStatus={emailConfirm}
        sortModel={sortModel}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSortModelChange={setSortModel}
        onStatusChange={handleStatusChange}
      />
      <EntityRoutes entityPages={USERS_PAGES} />
    </Container>
  );
}

export default UsersPage;
