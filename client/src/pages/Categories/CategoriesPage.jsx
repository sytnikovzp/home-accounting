import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useHasPermission from '../../hooks/useHasPermission';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import { useFetchAllCategoriesQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import ListTable from '../../components/ListTable/ListTable';

import CategoryAddPage from './CategoryAddPage';
import CategoryEditPage from './CategoryEditPage';
import CategoryRemovePage from './CategoryRemovePage';
import CategoryViewPage from './CategoryViewPage';

import { stylesEntityContainerSx, stylesEntityPagesBox } from '../../styles';

const CATEGORIES_PAGES = [
  { path: 'add', Component: CategoryAddPage },
  { path: 'edit/:uuid', Component: CategoryEditPage },
  { path: 'remove/:uuid', Component: CategoryRemovePage },
  { path: ':uuid', Component: CategoryViewPage },
];

function CategoriesPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const { hasPermission } = useHasPermission();
  const navigate = useNavigate();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: categoriesData,
    isFetching,
    error: fetchError,
  } = useFetchAllCategoriesQuery({
    page: currentPage,
    limit: pageSize,
    status: selectedStatus,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const categories = categoriesData?.data ?? [];
  const totalCount = categoriesData?.totalCount ?? 0;

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
    (category) => handleModalOpen('edit', category.uuid),
    [handleModalOpen]
  );

  const handleRemove = useCallback(
    (category) => handleModalOpen('remove', category.uuid),
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
        <Typography variant='h6'>Категорії витрат</Typography>
        {hasPermission('categories', 'add') && (
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
        linkEntity='categories'
        pagination={paginationConfig}
        rows={categories}
        selectedStatus={selectedStatus}
        sortModel={sortModel}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSortModelChange={setSortModel}
        onStatusChange={handleStatusChange}
      />
      <EntityRoutes
        entityPages={CATEGORIES_PAGES}
        handleModalClose={handleModalClose}
      />
    </Container>
  );
}

export default CategoriesPage;
