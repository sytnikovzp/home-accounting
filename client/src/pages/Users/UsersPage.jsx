import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';

import { pageTitles } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePageTitle from '../../hooks/usePageTitle';
import usePagination from '../../hooks/usePagination';

import {
  selectError,
  selectIsLoading,
  selectTotalCount,
  selectUsers,
} from '../../store/selectors/usersSelectors';
import { clearCurrent } from '../../store/slices/usersSlice';
import { fetchUsers } from '../../store/thunks/usersThunks';

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
  { path: 'password', Component: UserChangePasswordPage },
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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const users = useSelector(selectUsers);
  const totalCount = useSelector(selectTotalCount);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const fetchParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      emailVerificationStatus,
      sort: sortModel.field,
      order: sortModel.order,
    }),
    [currentPage, pageSize, emailVerificationStatus, sortModel]
  );

  useEffect(() => {
    dispatch(fetchUsers(fetchParams));
  }, [dispatch, fetchParams]);

  usePageTitle(location, USERS_TITLES);

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    dispatch(clearCurrent());
    navigate('/users');
  }, [dispatch, navigate]);

  const handleEdit = useCallback(
    (user) => handleModalOpen('edit', user.uuid),
    [handleModalOpen]
  );

  const handleDelete = useCallback(
    (user) => handleModalOpen('remove', user.uuid),
    [handleModalOpen]
  );

  const showPreloader = useDelayedPreloader(isLoading);

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Користувачів"...' />;
  }

  if (error) {
    return <Error error={error} />;
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
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSortModelChange={setSortModel}
        onStatusChange={(event) =>
          setEmailVerificationStatus(event.target.value)
        }
      />
      <EntityRoutes
        entityPages={USERS_PAGES}
        fetchEntities={fetchUsers}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default UsersPage;
