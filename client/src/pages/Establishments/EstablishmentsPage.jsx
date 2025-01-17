import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { uuidPattern } from '../../utils/sharedFunctions';
import restController from '../../api/rest/restController';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import EstablishmentAddPage from './EstablishmentAddPage';
import EstablishmentEditPage from './EstablishmentEditPage';
import EstablishmentRemovePage from './EstablishmentRemovePage';
import EstablishmentViewPage from './EstablishmentViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

function EstablishmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [establishments, setEstablishments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();
  const location = useLocation();

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/establishments');
  };

  const handleModalOpen = (mode, uuid = null) => {
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
      const { data, totalCount } =
        await restController.fetchAllEstablishments(params);
      setEstablishments(data || []);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedStatus, sortModel]);

  const pageTitles = useMemo(
    () => ({
      view: 'Деталі закладу | Моя бухгалтерія',
      add: 'Додавання закладу | Моя бухгалтерія',
      edit: 'Редагування закладу | Моя бухгалтерія',
      delete: 'Видалення закладу | Моя бухгалтерія',
      default: 'Заклади | Моя бухгалтерія',
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
    fetchEstablishments();
  }, [fetchEstablishments]);

  const showPreloader = useDelayedPreloader(isLoading);

  const renderRoutes = () => (
    <Routes>
      <Route
        element={
          <EstablishmentAddPage
            crudError={crudError}
            fetchEstablishments={fetchEstablishments}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='add'
      />
      <Route
        element={
          <EstablishmentEditPage
            crudError={crudError}
            fetchEstablishments={fetchEstablishments}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='edit/:uuid'
      />
      <Route
        element={
          <EstablishmentRemovePage
            crudError={crudError}
            fetchEstablishments={fetchEstablishments}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='delete/:uuid'
      />
      <Route
        element={<EstablishmentViewPage handleModalClose={handleModalClose} />}
        path=':uuid'
      />
    </Routes>
  );

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Закладів"...' />;
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
          Заклади
        </Typography>
        <Button
          color='success'
          sx={stylesEntityPageButton}
          variant='contained'
          onClick={() => handleModalOpen('add')}
        >
          Додати заклад
        </Button>
      </Box>
      <ListTable
        showStatusDropdown
        columns={[
          { field: 'logo', headerName: 'Лого', align: 'center' },
          { field: 'title', headerName: 'Назва закладу', align: 'left' },
        ]}
        linkEntity='establishments'
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
        }}
        rows={establishments}
        selectedStatus={selectedStatus}
        sortModel={sortModel}
        onDelete={(establishment) =>
          handleModalOpen('delete', establishment.uuid)
        }
        onEdit={(establishment) => handleModalOpen('edit', establishment.uuid)}
        onSortModelChange={setSortModel}
        onStatusChange={(event) => setSelectedStatus(event.target.value)}
      />
      {renderRoutes()}
    </>
  );
}

export default EstablishmentsPage;
