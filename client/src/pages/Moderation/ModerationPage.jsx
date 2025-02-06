import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import { pageTitles } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePageTitle from '../../hooks/usePageTitle';
import usePagination from '../../hooks/usePagination';
import { useFetchAllPendingItemsQuery } from '../../store/services';

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

function ModerationPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });

  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: moderationData,
    isLoading: isFetching,
    error: fetchError,
  } = useFetchAllPendingItemsQuery({
    page: currentPage,
    limit: pageSize,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const moderations = moderationData?.data ?? [];
  const totalCount = moderationData?.totalCount ?? 0;

  usePageTitle(location, MODERATIONS_TITLES);

  const handleModalOpen = useCallback(
    (moderation) => {
      const { path, uuid } = moderation;
      navigate(`/moderation/${path}/${uuid}`);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    navigate('/moderation');
  }, [navigate]);

  const showPreloader = useDelayedPreloader(isFetching);

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Модерацій"...' />;
  }

  if (fetchError) {
    return <Error error={fetchError.data.message} />;
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
        isModerationPage={true}
        linkEntity='moderation'
        pagination={{
          currentPage,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          pageSize,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
          totalCount,
        }}
        rows={moderations}
        sortModel={sortModel}
        onModerate={handleModalOpen}
        onSortModelChange={setSortModel}
      />
      <EntityRoutes
        entityPages={MODERATIONS_PAGES}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default ModerationPage;
