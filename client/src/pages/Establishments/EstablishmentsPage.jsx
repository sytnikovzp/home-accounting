import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { pageTitles } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePageTitle from '../../hooks/usePageTitle';
import usePagination from '../../hooks/usePagination';
import { useFetchAllEstablishmentsQuery } from '../../store/services';

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

  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: establishmentsData,
    isLoading: isFetching,
    error: fetchError,
  } = useFetchAllEstablishmentsQuery({
    page: currentPage,
    limit: pageSize,
    status: selectedStatus,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const establishments = establishmentsData?.data ?? [];
  const totalCount = establishmentsData?.totalCount ?? 0;

  usePageTitle(location, ESTABLISHMENTS_TITLES);

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    navigate('/establishments');
  }, [navigate]);

  const handleAddClick = useCallback(() => {
    handleModalOpen('add');
  }, [handleModalOpen]);

  const handleEdit = useCallback(
    (establishment) => handleModalOpen('edit', establishment.uuid),
    [handleModalOpen]
  );

  const handleRemove = useCallback(
    (establishment) => handleModalOpen('remove', establishment.uuid),
    [handleModalOpen]
  );

  const handleStatusChange = useCallback((event) => {
    setSelectedStatus(event.target.value);
  }, []);

  const showPreloader = useDelayedPreloader(isFetching);

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Закладів"...' />;
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
          Заклади
        </Typography>
        <Button
          color='success'
          sx={stylesEntityPageButton}
          variant='contained'
          onClick={handleAddClick}
        >
          Додати заклад
        </Button>
      </Box>
      <ListTable
        showStatusDropdown
        linkEntity='establishments'
        pagination={{
          currentPage,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          pageSize,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
          totalCount,
        }}
        rows={establishments}
        selectedStatus={selectedStatus}
        sortModel={sortModel}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSortModelChange={setSortModel}
        onStatusChange={handleStatusChange}
      />
      <EntityRoutes
        entityPages={ESTABLISHMENTS_PAGES}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default EstablishmentsPage;
