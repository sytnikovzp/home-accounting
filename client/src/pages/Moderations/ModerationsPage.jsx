import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';

import { pageTitles } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePageTitle from '../../hooks/usePageTitle';
import usePagination from '../../hooks/usePagination';

import {
  selectModerations,
  selectModerationsError,
  selectModerationsIsLoading,
  selectTotalCount,
} from '../../store/selectors/moderationsSelectors';
import { clearCurrent } from '../../store/slices/moderationsSlice';
import { fetchModerations } from '../../store/thunks/moderationsThunks';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import ContentModerationPage from './ContentModerationPage';

import { stylesEntityPageBox, stylesEntityPageTypography } from '../../styles';

const { MODERATIONS_TITLES } = pageTitles;
const MODERATIONS_PAGES = [
  { path: ':path/:uuid', Component: ContentModerationPage },
];

function ModerationsPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const moderations = useSelector(selectModerations);
  const totalCount = useSelector(selectTotalCount);
  const isLoading = useSelector(selectModerationsIsLoading);
  const error = useSelector(selectModerationsError);

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
    dispatch(fetchModerations(fetchParams));
  }, [dispatch, fetchParams]);

  usePageTitle(location, MODERATIONS_TITLES);

  const handleModalOpen = useCallback(
    (moderation) => {
      const { path, uuid } = moderation;
      navigate(`/moderation/${path}/${uuid}`);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    dispatch(clearCurrent());
    navigate('/moderation');
  }, [dispatch, navigate]);

  const showPreloader = useDelayedPreloader(isLoading);

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Модерацій"...' />;
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
      <EntityRoutes
        entityPages={MODERATIONS_PAGES}
        fetchEntities={fetchModerations}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default ModerationsPage;
