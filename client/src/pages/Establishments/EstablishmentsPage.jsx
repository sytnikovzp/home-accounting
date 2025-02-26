import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import { useFetchAllEstablishmentsQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import ListTable from '../../components/ListTable/ListTable';

import EstablishmentAddPage from './EstablishmentAddPage';
import EstablishmentEditPage from './EstablishmentEditPage';
import EstablishmentRemovePage from './EstablishmentRemovePage';
import EstablishmentViewPage from './EstablishmentViewPage';

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

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: establishmentsData,
    isFetching,
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

  const handleStatusChange = (newStatus) => setSelectedStatus(newStatus);

  return (
    <Container maxWidth='lg' sx={{ py: 2 }}>
      <Box
        alignItems='center'
        display='flex'
        justifyContent='space-between'
        mb={2}
      >
        <Typography variant='h6'>Заклади</Typography>
        <Button
          color='success'
          size='small'
          variant='contained'
          onClick={handleAddClick}
        >
          Додати
        </Button>
      </Box>
      <ListTable
        showStatusDropdown
        fetchError={fetchError}
        isFetching={isFetching}
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
    </Container>
  );
}

export default EstablishmentsPage;
