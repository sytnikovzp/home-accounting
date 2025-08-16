import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useHasPermission from '@/src/hooks/useHasPermission';
import useItemsPerPage from '@/src/hooks/useItemsPerPage';
import usePagination from '@/src/hooks/usePagination';

import { useFetchAllEstablishmentsQuery } from '@/src/store/services';

import EntityRoutes from '@/src/components/EntityRoutes/EntityRoutes';
import ListTable from '@/src/components/ListTable/ListTable';

import EstablishmentAddPage from '@/src/pages/Establishments/EstablishmentAddPage';
import EstablishmentEditPage from '@/src/pages/Establishments/EstablishmentEditPage';
import EstablishmentRemovePage from '@/src/pages/Establishments/EstablishmentRemovePage';
import EstablishmentViewPage from '@/src/pages/Establishments/EstablishmentViewPage';

import { stylesEntityContainerSx, stylesEntityPagesBox } from '@/src/styles';

const ESTABLISHMENTS_PAGES = [
  { path: 'add', Component: EstablishmentAddPage },
  { path: 'edit/:uuid', Component: EstablishmentEditPage },
  { path: 'remove/:uuid', Component: EstablishmentRemovePage },
  { path: ':uuid', Component: EstablishmentViewPage },
];

function EstablishmentsPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const { hasPermission } = useHasPermission();
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
    navigate(-1);
  }, [navigate]);

  const handleAdd = useCallback(() => {
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

  const handleStatusChange = useCallback(
    (newStatus) => setSelectedStatus(newStatus),
    []
  );

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
        <Typography variant='h6'>Заклади</Typography>
        {hasPermission('establishments', 'add') && (
          <Button
            color='success'
            size='small'
            variant='contained'
            onClick={handleAdd}
          >
            Додати
          </Button>
        )}
      </Box>
      <ListTable
        showStatusDropdown
        fetchError={fetchError}
        isFetching={isFetching}
        linkEntity='establishments'
        pagination={paginationConfig}
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
