import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import { DELAY_SHOW_PRELOADER } from '../../constants';
import { uuidPattern } from '../../utils/sharedFunctions';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import ContentModerationPage from './ContentModerationPage';

import { stylesEntityPageBox, stylesEntityPageTypography } from '../../styles';

function ModerationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [moderations, setModerations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();
  const location = useLocation();

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/moderation');
  };

  const handleModalOpen = (moderation) => {
    const { path, uuid } = moderation;
    const allowedPaths = ['category', 'product', 'establishment'];
    if (allowedPaths.includes(path) && uuid) {
      navigate(`/moderation/${path}/${uuid}`);
    } else {
      console.error('Недійсний шлях або UUID відсутній:', moderation);
    }
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
      const { data, totalCount } =
        await restController.fetchAllPendingItems(params);
      setModerations(data || []);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortModel]);

  const pageTitles = useMemo(
    () => ({
      view: 'Модерація контенту | Моя бухгалтерія',
      default: 'Підлягають модерації | Моя бухгалтерія',
    }),
    []
  );

  useEffect(() => {
    const pathKey = Object.keys(pageTitles).find((key) =>
      location.pathname.includes(key)
    );
    const isUuid = uuidPattern.test(location.pathname);
    document.title = isUuid
      ? pageTitles.view
      : pageTitles[pathKey] || pageTitles.default;
  }, [location, pageTitles]);

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
        element={
          <ContentModerationPage
            crudError={crudError}
            fetchModerations={fetchModerations}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path=':path/:uuid'
      />
    </Routes>
  );

  if (showPreloader)
    return <Preloader message='Завантаження списку "Модерацій"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

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
          Підлягають модерації
        </Typography>
      </Box>
      <ListTable
        disableClickableTitles
        columns={[
          { field: 'contentType', headerName: 'Тип контенту', align: 'left' },
          { field: 'title', headerName: 'Назва', align: 'left' },
        ]}
        isModerationPage={true}
        linkEntity='moderations'
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
        }}
        rows={moderations}
        sortModel={sortModel}
        onModerate={handleModalOpen}
        onSortModelChange={setSortModel}
      />
      {renderRoutes()}
    </>
  );
}

export default ModerationsPage;
