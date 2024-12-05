import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
// ==============================================================
import ShopAddPage from './ShopAddPage';
import ShopEditPage from './ShopEditPage';
import ShopDeletePage from './ShopDeletePage';
import ShopViewPage from './ShopViewPage';
// ==============================================================
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';

function ShopsPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [shops, setShops] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [sortModel, setSortModel] = useState({ field: 'id', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/shops');
  };

  const openModal = (mode, id = null) => {
    navigate(id ? `${mode}/${id}` : mode);
  };

  const fetchShops = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        status: selectedStatus,
        sort: sortModel.field,
        order: sortModel.order,
      };
      const { data, totalCount } = await restController.fetchAllShops(params);
      setShops(data);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errors?.[0]?.title || 'Помилка завантаження даних'
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedStatus, sortModel]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const renderRoutes = () => (
    <Routes>
      <Route
        path='add'
        element={
          <ShopAddPage
            handleModalClose={handleModalClose}
            fetchShops={fetchShops}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='edit/:id'
        element={
          <ShopEditPage
            handleModalClose={handleModalClose}
            fetchShops={fetchShops}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='delete/:id'
        element={
          <ShopDeletePage
            handleModalClose={handleModalClose}
            fetchShops={fetchShops}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path=':id'
        element={<ShopViewPage handleModalClose={handleModalClose} />}
      />
    </Routes>
  );

  if (isLoading)
    return <Preloader message='Завантаження списку "Магазинів"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Магазини</Typography>
        <Button
          variant='contained'
          color='success'
          size='small'
          onClick={() => openModal('add')}
        >
          Додати магазин
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'id', headerName: 'ID', align: 'center' },
          { field: 'title', headerName: 'Назва магазину', align: 'left' },
          { field: 'logo', headerName: 'Логотип', align: 'center' },
        ]}
        rows={shops}
        onEdit={(shop) => openModal('edit', shop.id)}
        onDelete={(shop) => openModal('delete', shop.id)}
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 10, 25, 50],
        }}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        selectedStatus={selectedStatus}
        onStatusChange={(event) => setSelectedStatus(event.target.value)}
        showStatusDropdown
        linkEntity='shops'
      />
      {renderRoutes()}
    </>
  );
}

export default ShopsPage;
