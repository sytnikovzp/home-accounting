import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import { pageTitles } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePageTitle from '../../hooks/usePageTitle';
import usePagination from '../../hooks/usePagination';
import { useFetchAllUsersQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import UserChangePasswordPage from './UserChangePasswordPage';
import UserEditPage from './UserEditPage';
import UserRemovePage from './UserRemovePage';
import UserViewPage from './UserViewPage';

import { stylesEntityPageBox, stylesEntityPageTypography } from '../../styles';

const { USERS_TITLES } = pageTitles;
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
  const [emailVerificationStatus, setEmailVerificationStatus] = useState('all');

  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: usersData,
    isLoading: isFetching,
    error: fetchError,
  } = useFetchAllUsersQuery({
    page: currentPage,
    limit: pageSize,
    emailVerificationStatus,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const users = usersData?.data ?? [];
  const totalCount = usersData?.totalCount ?? 0;

  usePageTitle(location, USERS_TITLES);

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    navigate('/users');
  }, [navigate]);

  const handleEdit = useCallback(
    (user) => handleModalOpen('edit', user.uuid),
    [handleModalOpen]
  );

  const handleRemove = useCallback(
    (user) => handleModalOpen('remove', user.uuid),
    [handleModalOpen]
  );

  const handleStatusChange = useCallback((event) => {
    setEmailVerificationStatus(event.target.value);
  }, []);

  const showPreloader = useDelayedPreloader(isFetching);

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Користувачів"...' />;
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
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSortModelChange={setSortModel}
        onStatusChange={handleStatusChange}
      />
      <EntityRoutes
        entityPages={USERS_PAGES}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default UsersPage;
