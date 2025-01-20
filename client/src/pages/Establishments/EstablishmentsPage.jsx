import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';

import { pageTitles } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePageTitle from '../../hooks/usePageTitle';
import usePagination from '../../hooks/usePagination';

import {
  selectEstablishments,
  selectEstablishmentsError,
  selectEstablishmentsIsLoading,
  selectTotalCount,
} from '../../store/selectors/establishmentsSelectors';
import { clearCurrent } from '../../store/slices/establishmentsSlice';
import { fetchEstablishments } from '../../store/thunks/establishmentsThunks';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import EstablishmentAddPage from './EstablishmentAddPage';
import EstablishmentEditPage from './EstablishmentEditPage';
import EstablishmentRemovePage from './EstablishmentRemovePage';
import EstablishmentViewPage from './EstablishmentViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

const { ESTABLISHMENTS_TITLES } = pageTitles;
const ESTABLISHMENTS_PAGES = [
  { path: 'add', Component: EstablishmentAddPage },
  { path: 'edit/:uuid', Component: EstablishmentEditPage },
  { path: 'remove/:uuid', Component: EstablishmentRemovePage },
  { path: ':uuid', Component: EstablishmentViewPage },
];

function EstablishmentsPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [selectedStatus, setSelectedStatus] = useState('approved');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const establishments = useSelector(selectEstablishments);
  const totalCount = useSelector(selectTotalCount);
  const isLoading = useSelector(selectEstablishmentsIsLoading);
  const error = useSelector(selectEstablishmentsError);

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const fetchParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      status: selectedStatus,
      sort: sortModel.field,
      order: sortModel.order,
    }),
    [currentPage, pageSize, selectedStatus, sortModel]
  );

  useEffect(() => {
    dispatch(fetchEstablishments(fetchParams));
  }, [dispatch, fetchParams]);

  usePageTitle(location, ESTABLISHMENTS_TITLES);

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    dispatch(clearCurrent());
    navigate('/establishments');
  }, [dispatch, navigate]);

  const handleEdit = useCallback(
    (establishment) => handleModalOpen('edit', establishment.uuid),
    [handleModalOpen]
  );

  const handleDelete = useCallback(
    (establishment) => handleModalOpen('remove', establishment.uuid),
    [handleModalOpen]
  );

  const showPreloader = useDelayedPreloader(isLoading);

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Закладів"...' />;
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
          Заклади
        </Typography>
        <Button
          color='success'
          sx={stylesEntityPageButton}
          variant='contained'
          onClick={() => handleModalOpen('add')}
        >
          Додати заклад
        </Button>
      </Box>
      <ListTable
        showStatusDropdown
        columns={[
          { field: 'logo', headerName: 'Лого', align: 'center' },
          { field: 'title', headerName: 'Назва закладу', align: 'left' },
        ]}
        linkEntity='establishments'
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
        }}
        rows={establishments}
        selectedStatus={selectedStatus}
        sortModel={sortModel}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSortModelChange={setSortModel}
        onStatusChange={(event) => setSelectedStatus(event.target.value)}
      />
      <EntityRoutes
        entityPages={ESTABLISHMENTS_PAGES}
        fetchEntities={fetchEstablishments}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default EstablishmentsPage;
