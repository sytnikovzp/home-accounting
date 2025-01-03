import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box } from '@mui/material';
// ==============================================================
import { DELAY_SHOW_PRELOADER } from '../../constants';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
// ==============================================================
import EstablishmentAddPage from './EstablishmentAddPage';
import EstablishmentEditPage from './EstablishmentEditPage';
import EstablishmentDeletePage from './EstablishmentDeletePage';
import EstablishmentViewPage from './EstablishmentViewPage';
// ==============================================================
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';

function EstablishmentsPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [establishments, setEstablishments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/establishments');
  };

  const openModal = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  const fetchEstablishments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        status: selectedStatus,
        sort: sortModel.field,
        order: sortModel.order,
      };
      const { data, totalCount } = await restController.fetchAllEstablishments(
        params
      );
      setEstablishments(data || []);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedStatus, sortModel]);

  useEffect(() => {
    fetchEstablishments();
  }, [fetchEstablishments]);

  useEffect(() => {
    let timeout;
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
        path='add'
        element={
          <EstablishmentAddPage
            handleModalClose={handleModalClose}
            fetchEstablishments={fetchEstablishments}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='edit/:uuid'
        element={
          <EstablishmentEditPage
            handleModalClose={handleModalClose}
            fetchEstablishments={fetchEstablishments}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='delete/:uuid'
        element={
          <EstablishmentDeletePage
            handleModalClose={handleModalClose}
            fetchEstablishments={fetchEstablishments}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path=':uuid'
        element={<EstablishmentViewPage handleModalClose={handleModalClose} />}
      />
    </Routes>
  );

  if (showPreloader)
    return <Preloader message='Завантаження списку "Закладів"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Заклади</Typography>
        <Button
          variant='contained'
          color='success'
          size='small'
          onClick={() => openModal('add')}
        >
          Додати заклад
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'logo', headerName: 'Лого', align: 'center' },
          { field: 'title', headerName: 'Назва закладу', align: 'left' },
        ]}
        rows={establishments}
        onEdit={(establishment) => openModal('edit', establishment.uuid)}
        onDelete={(establishment) => openModal('delete', establishment.uuid)}
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
        }}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        selectedStatus={selectedStatus}
        onStatusChange={(event) => setSelectedStatus(event.target.value)}
        showStatusDropdown
        linkEntity='establishments'
      />
      {renderRoutes()}
    </>
  );
}

export default EstablishmentsPage;
