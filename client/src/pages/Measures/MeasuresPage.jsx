import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { DELAY_SHOW_PRELOADER } from '../../constants';
import { uuidPattern } from '../../utils/sharedFunctions';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import MeasureAddPage from './MeasureAddPage';
import MeasureRemovePage from './MeasureRemovePage';
import MeasureEditPage from './MeasureEditPage';
import MeasureViewPage from './MeasureViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

function MeasuresPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [measures, setMeasures] = useState([]);
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
    navigate('/measures');
  };

  const handleModalOpen = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  const fetchMeasures = useCallback(async () => {
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
        await restController.fetchAllMeasures(params);
      setMeasures(data || []);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortModel]);

  const pageTitles = useMemo(
    () => ({
      view: 'Деталі одиниці | Моя бухгалтерія',
      add: 'Додавання одиниці | Моя бухгалтерія',
      edit: 'Редагування одиниці | Моя бухгалтерія',
      delete: 'Видалення одиниці | Моя бухгалтерія',
      default: 'Одиниці вимірів | Моя бухгалтерія',
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
    fetchMeasures();
  }, [fetchMeasures]);

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
          <MeasureAddPage
            crudError={crudError}
            fetchMeasures={fetchMeasures}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='add'
      />
      <Route
        element={
          <MeasureEditPage
            crudError={crudError}
            fetchMeasures={fetchMeasures}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='edit/:uuid'
      />
      <Route
        element={
          <MeasureRemovePage
            crudError={crudError}
            fetchMeasures={fetchMeasures}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='delete/:uuid'
      />
      <Route
        element={<MeasureViewPage handleModalClose={handleModalClose} />}
        path=':uuid'
      />
    </Routes>
  );

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Одиниць вимірів"...' />;
  }
  if (errorMessage) {
    return <Error error={errorMessage} />;
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
          Одиниці вимірів
        </Typography>
        <Button
          color='success'
          sx={stylesEntityPageButton}
          variant='contained'
          onClick={() => handleModalOpen('add')}
        >
          Додати одиницю
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'title', headerName: 'Назва одиниці', align: 'left' },
        ]}
        linkEntity='measures'
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
        }}
        rows={measures}
        sortModel={sortModel}
        onDelete={(measure) => handleModalOpen('delete', measure.uuid)}
        onEdit={(measure) => handleModalOpen('edit', measure.uuid)}
        onSortModelChange={setSortModel}
      />
      {renderRoutes()}
    </>
  );
}

export default MeasuresPage;
