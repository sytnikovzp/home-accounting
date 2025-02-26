import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import { useFetchAllMeasuresQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import ListTable from '../../components/ListTable/ListTable';

import MeasureAddPage from './MeasureAddPage';
import MeasureEditPage from './MeasureEditPage';
import MeasureRemovePage from './MeasureRemovePage';
import MeasureViewPage from './MeasureViewPage';

const MEASURES_PAGES = [
  { path: 'add', Component: MeasureAddPage },
  { path: 'edit/:uuid', Component: MeasureEditPage },
  { path: 'remove/:uuid', Component: MeasureRemovePage },
  { path: ':uuid', Component: MeasureViewPage },
];

function MeasuresPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const navigate = useNavigate();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: measuresData,
    isFetching,
    error: fetchError,
  } = useFetchAllMeasuresQuery({
    page: currentPage,
    limit: pageSize,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const measures = measuresData?.data ?? [];
  const totalCount = measuresData?.totalCount ?? 0;

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    navigate('/measures');
  }, [navigate]);

  const handleAddClick = useCallback(() => {
    handleModalOpen('add');
  }, [handleModalOpen]);

  const handleEdit = useCallback(
    (measure) => handleModalOpen('edit', measure.uuid),
    [handleModalOpen]
  );

  const handleRemove = useCallback(
    (measure) => handleModalOpen('remove', measure.uuid),
    [handleModalOpen]
  );

  return (
    <Container maxWidth='lg' sx={{ py: 2 }}>
      <Box
        alignItems='center'
        display='flex'
        justifyContent='space-between'
        mb={2}
      >
        <Typography variant='h6'>Одиниці вимірів</Typography>
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
        fetchError={fetchError}
        isFetching={isFetching}
        linkEntity='measures'
        pagination={{
          currentPage,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          pageSize,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
          totalCount,
        }}
        rows={measures}
        sortModel={sortModel}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSortModelChange={setSortModel}
      />
      <EntityRoutes
        entityPages={MEASURES_PAGES}
        handleModalClose={handleModalClose}
      />
    </Container>
  );
}

export default MeasuresPage;
