import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
import { useFetchAllCategoriesQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import CategoryAddPage from './CategoryAddPage';
import CategoryEditPage from './CategoryEditPage';
import CategoryRemovePage from './CategoryRemovePage';
import CategoryViewPage from './CategoryViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

const CATEGORIES_PAGES = [
  { path: 'add', Component: CategoryAddPage },
  { path: 'edit/:uuid', Component: CategoryEditPage },
  { path: 'remove/:uuid', Component: CategoryRemovePage },
  { path: ':uuid', Component: CategoryViewPage },
];

function CategoriesPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [selectedStatus, setSelectedStatus] = useState('approved');
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
    navigate('/categories');
  }, [navigate]);

  const handleAddClick = useCallback(() => {
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

  const handleStatusChange = (event) => setSelectedStatus(event.target.value);

  const isPreloaderVisible = useDelayedPreloader(isFetching);

  if (isPreloaderVisible) {
    return <Preloader message='Завантаження списку "Категорій"...' />;
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
          Категорії витрат
        </Typography>
        <Button
          color='success'
          sx={stylesEntityPageButton}
          variant='contained'
          onClick={handleAddClick}
        >
          Додати категорію
        </Button>
      </Box>
      <ListTable
        showStatusDropdown
        linkEntity='categories'
        pagination={{
          currentPage,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          pageSize,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
          totalCount,
        }}
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
    </>
  );
}

export default CategoriesPage;
