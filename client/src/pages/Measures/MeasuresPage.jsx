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
  selectMeasures,
  selectMeasuresError,
  selectMeasuresIsLoading,
  selectTotalCount,
} from '../../store/selectors/measuresSelectors';
import { clearCurrent } from '../../store/slices/measuresSlice';
import { fetchMeasures } from '../../store/thunks/measuresThunks';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import MeasureAddPage from './MeasureAddPage';
import MeasureEditPage from './MeasureEditPage';
import MeasureRemovePage from './MeasureRemovePage';
import MeasureViewPage from './MeasureViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

const { MEASURES_TITLES } = pageTitles;
const MEASURES_PAGES = [
  { path: 'add', Component: MeasureAddPage },
  { path: 'edit/:uuid', Component: MeasureEditPage },
  { path: 'remove/:uuid', Component: MeasureRemovePage },
  { path: ':uuid', Component: MeasureViewPage },
];

function MeasuresPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const measures = useSelector(selectMeasures);
  const totalCount = useSelector(selectTotalCount);
  const isLoading = useSelector(selectMeasuresIsLoading);
  const error = useSelector(selectMeasuresError);

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const fetchParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      sort: sortModel.field,
      order: sortModel.order,
    }),
    [currentPage, pageSize, sortModel]
  );

  useEffect(() => {
    dispatch(fetchMeasures(fetchParams));
  }, [dispatch, fetchParams]);

  usePageTitle(location, MEASURES_TITLES);

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    dispatch(clearCurrent());
    navigate('/measures');
  }, [dispatch, navigate]);

  const handleEdit = useCallback(
    (measure) => handleModalOpen('edit', measure.uuid),
    [handleModalOpen]
  );

  const handleDelete = useCallback(
    (measure) => handleModalOpen('remove', measure.uuid),
    [handleModalOpen]
  );

  const showPreloader = useDelayedPreloader(isLoading);

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Одиниць вимірів"...' />;
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
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSortModelChange={setSortModel}
      />
      <EntityRoutes
        entityPages={MEASURES_PAGES}
        fetchEntities={fetchMeasures}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default MeasuresPage;
