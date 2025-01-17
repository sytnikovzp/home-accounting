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
  selectCategories,
  selectError,
  selectIsLoading,
  selectTotalCount,
} from '../../store/selectors/categoriesSelectors';
import { clearCurrent } from '../../store/slices/categoriesSlice';
import { fetchCategories } from '../../store/thunks/categoriesThunks';

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

const { CATEGORIES_TITLES } = pageTitles;
const CATEGORIES_PAGES = [
  { path: 'add', Component: CategoryAddPage },
  { path: 'edit/:uuid', Component: CategoryEditPage },
  { path: 'delete/:uuid', Component: CategoryRemovePage },
  { path: ':uuid', Component: CategoryViewPage },
];

function CategoriesPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [selectedStatus, setSelectedStatus] = useState('approved');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const categories = useSelector(selectCategories);
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
      status: selectedStatus,
      sort: sortModel.field,
      order: sortModel.order,
    }),
    [currentPage, pageSize, selectedStatus, sortModel]
  );

  useEffect(() => {
    dispatch(fetchCategories(fetchParams));
  }, [dispatch, fetchParams]);

  usePageTitle(location, CATEGORIES_TITLES);

  const handleModalClose = useCallback(() => {
    dispatch(clearCurrent());
    navigate('/categories');
  }, [dispatch, navigate]);

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (category) => handleModalOpen('delete', category.uuid),
    [handleModalOpen]
  );
  const handleEdit = useCallback(
    (category) => handleModalOpen('edit', category.uuid),
    [handleModalOpen]
  );

  const showPreloader = useDelayedPreloader(isLoading);

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Категорій"...' />;
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
          Категорії витрат
        </Typography>
        <Button
          color='success'
          sx={stylesEntityPageButton}
          variant='contained'
          onClick={() => handleModalOpen('add')}
        >
          Додати категорію
        </Button>
      </Box>
      <ListTable
        showStatusDropdown
        columns={[
          { field: 'title', headerName: 'Назва категорії', align: 'left' },
        ]}
        linkEntity='categories'
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
        }}
        rows={categories}
        selectedStatus={selectedStatus}
        sortModel={sortModel}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSortModelChange={setSortModel}
        onStatusChange={(event) => setSelectedStatus(event.target.value)}
      />
      <EntityRoutes
        entityPages={CATEGORIES_PAGES}
        fetchEntities={fetchCategories}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default CategoriesPage;
