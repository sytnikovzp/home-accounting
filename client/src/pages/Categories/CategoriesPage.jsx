import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';

import { DELAY_SHOW_PRELOADER } from '../../constants';
import { uuidPattern } from '../../utils/sharedFunctions';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesShowPreloader,
  selectCategoriesTotalCount,
} from '../../store/selectors/categoriesSelectors';
import { resetState } from '../../store/slices/categoriesSlice';
import { fetchCategories } from '../../store/thunks/categoriesThunks';

import CategoryAddPage from './CategoryAddPage';
import CategoryDeletePage from './CategoryDeletePage';
import CategoryEditPage from './CategoryEditPage';
import CategoryViewPage from './CategoryViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

function CategoriesPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [timeoutReached, setTimeoutReached] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const categories = useSelector(selectCategories);
  const totalCount = useSelector(selectCategoriesTotalCount);
  const loading = useSelector(selectCategoriesLoading);
  const showPreloader = useSelector(selectCategoriesShowPreloader);

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const fetchCategoriesList = useCallback(() => {
    dispatch(
      fetchCategories({
        page: currentPage,
        limit: pageSize,
        status: selectedStatus,
        sort: sortModel.field,
        order: sortModel.order,
      })
    );
  }, [dispatch, currentPage, pageSize, selectedStatus, sortModel]);

  const pageTitles = useMemo(
    () => ({
      view: 'Деталі категорії | Моя бухгалтерія',
      add: 'Додавання категорії | Моя бухгалтерія',
      edit: 'Редагування категорії | Моя бухгалтерія',
      delete: 'Видалення категорії | Моя бухгалтерія',
      default: 'Категорії витрат | Моя бухгалтерія',
    }),
    []
  );

  const handleModalClose = () => {
    dispatch(resetState());
    fetchCategoriesList();
    navigate('/categories');
  };

  const handleModalOpen = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  useEffect(() => {
    const pathKey = Object.keys(pageTitles).find((key) =>
      location.pathname.includes(key)
    );
    const isUuid = uuidPattern.test(location.pathname);
    const isEditOrDelete =
      location.pathname.includes('edit') ||
      location.pathname.includes('delete');
    document.title =
      isUuid && !isEditOrDelete
        ? pageTitles.view
        : pageTitles[pathKey] || pageTitles.default;
  }, [location, pageTitles]);

  useEffect(() => {
    fetchCategoriesList();
  }, [fetchCategoriesList]);

  useEffect(() => {
    let timeout;
    if (loading) {
      timeout = setTimeout(() => setTimeoutReached(true), DELAY_SHOW_PRELOADER);
    } else {
      setTimeoutReached(false);
    }
    return () => clearTimeout(timeout);
  }, [loading]);

  const renderRoutes = () => (
    <Routes>
      <Route
        element={
          <CategoryAddPage
            fetchCategoriesList={fetchCategoriesList}
            handleModalClose={handleModalClose}
          />
        }
        path='add'
      />
      <Route
        element={
          <CategoryEditPage
            fetchCategoriesList={fetchCategoriesList}
            handleModalClose={handleModalClose}
          />
        }
        path='edit/:uuid'
      />
      <Route
        element={<CategoryDeletePage handleModalClose={handleModalClose} />}
        path='delete/:uuid'
      />
      <Route
        element={<CategoryViewPage handleModalClose={handleModalClose} />}
        path=':uuid'
      />
    </Routes>
  );

  if (showPreloader || timeoutReached)
    return <Preloader message='Завантаження списку "Категорій"...' />;

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
        onDelete={(category) => handleModalOpen('delete', category.uuid)}
        onEdit={(category) => handleModalOpen('edit', category.uuid)}
        onSortModelChange={setSortModel}
        onStatusChange={(event) => setSelectedStatus(event.target.value)}
      />
      {renderRoutes()}
    </>
  );
}

export default CategoriesPage;
