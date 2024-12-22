import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Typography, Box } from '@mui/material';
// ==============================================================
import { DELAY_SHOW_PRELOADER } from '../../constants';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
// ==============================================================
import ModerationViewPage from './ModerationViewPage';
// ==============================================================
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';

function ModerationPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [moderations, setModerations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/moderations');
  };

  const openModal = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  const fetchModerations = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        sort: sortModel.field,
        order: sortModel.order,
      };
      const { data, totalCount } = await restController.fetchAllPendingItems(
        params
      );
      setModerations(data);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка завантаження даних'
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortModel]);

  useEffect(() => {
    fetchModerations();
  }, [fetchModerations]);

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
        path=':uuid'
        element={<ModerationViewPage handleModalClose={handleModalClose} />}
      />
    </Routes>
  );

  if (showPreloader)
    return <Preloader message='Завантаження списку "Модерації"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Модерація</Typography>
      </Box>
      <ListTable
        columns={[
          { field: 'type', headerName: 'Тип', align: 'left' },
          { field: 'title', headerName: 'Назва', align: 'left' },
        ]}
        rows={moderations}
        onEdit={(moderation) => openModal('edit', moderation.uuid)}
        onDelete={(moderation) => openModal('delete', moderation.uuid)}
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
        linkEntity='moderations'
      />
      {renderRoutes()}
    </>
  );
}

export default ModerationPage;
