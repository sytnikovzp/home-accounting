import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
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

import { stylesEntityPageBox, stylesEntityPageTypography } from '../../styles';

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
  const [emailVerified, setEmailVerified] = useState('all');
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
    emailVerified,
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

  const handleStatusChange = (newStatus) => setEmailVerified(newStatus);

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
        fetchError={fetchError}
        isFetching={isFetching}
        linkEntity='users'
        pagination={{
          currentPage,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          pageSize,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
          totalCount,
        }}
        rows={users}
        selectedStatus={emailVerified}
        sortModel={sortModel}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSortModelChange={setSortModel}
        onStatusChange={handleStatusChange}
      />
      <EntityRoutes entityPages={USERS_PAGES} />
    </>
  );
}

export default UsersPage;
