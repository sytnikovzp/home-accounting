import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';

import { DELAY_SHOW_PRELOADER } from '../../constants';
import { uuidPattern } from '../../utils/sharedFunctions';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import {
  selectCategories,
  selectError,
  selectIsLoading,
  selectTotalCount,
} from '../../store/selectors/categoriesSelectors';
import { clearCurrent } from '../../store/slices/categoriesSlice';
import { fetchCategories } from '../../store/thunks/categoriesThunks';

import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import CategoryAddPage from './CategoryAddPage';
import CategoryRemovePage from './CategoryRemovePage';
import CategoryEditPage from './CategoryEditPage';
import CategoryViewPage from './CategoryViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

function CategoriesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const categories = useSelector(selectCategories);
  const totalCount = useSelector(selectTotalCount);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const [showPreloader, setShowPreloader] = useState(false);
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [selectedStatus, setSelectedStatus] = useState('approved');

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const handleModalClose = () => {
    dispatch(clearCurrent());
    navigate('/categories');
  };

  const handleModalOpen = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  useEffect(() => {
    dispatch(
      fetchCategories({
        page: currentPage,
        limit: pageSize,
        status: selectedStatus,
        sort: sortModel.field,
        order: sortModel.order,
      })
    );
  }, [currentPage, dispatch, selectedStatus, pageSize, sortModel]);

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
    let timeout = null;
    if (isLoading) {
      timeout = setTimeout(() => setShowPreloader(true), DELAY_SHOW_PRELOADER);
    } else {
      setShowPreloader(false);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const renderRoutes = () => (
    <Routes>
      <Route
        element={
          <CategoryAddPage
            fetchCategories={fetchCategories}
            handleModalClose={handleModalClose}
          />
        }
        path='add'
      />
      <Route
        element={
          <CategoryEditPage
            fetchCategories={fetchCategories}
            handleModalClose={handleModalClose}
          />
        }
        path='edit/:uuid'
      />
      <Route
        element={
          <CategoryRemovePage
            fetchCategories={fetchCategories}
            handleModalClose={handleModalClose}
          />
        }
        path='delete/:uuid'
      />
      <Route
        element={
          <CategoryViewPage
            fetchCategories={fetchCategories}
            handleModalClose={handleModalClose}
          />
        }
        path=':uuid'
      />
    </Routes>
  );

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
