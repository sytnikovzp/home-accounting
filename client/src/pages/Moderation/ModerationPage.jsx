import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import { useFetchAllPendingItemsQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import ListTable from '../../components/ListTable/ListTable';

import ContentModerationPage from './ContentModerationPage';

import { stylesEntityContainerSx, stylesEntityPagesBox } from '../../styles';

const MODERATIONS_PAGES = [
  { path: ':path/:uuid', Component: ContentModerationPage },
];

function ModerationPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const navigate = useNavigate();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: moderationData,
    isFetching,
    error: fetchError,
  } = useFetchAllPendingItemsQuery({
    page: currentPage,
    limit: pageSize,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const moderations = moderationData?.data ?? [];
  const totalCount = moderationData?.totalCount ?? 0;

  const handleModalOpen = useCallback(
    (moderation) => {
      const { path, uuid } = moderation;
      navigate(`/moderation/${path}/${uuid}`);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const paginationConfig = useMemo(
    () => ({
      currentPage,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
      pageSize,
      rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
      totalCount,
    }),
    [
      currentPage,
      handlePageChange,
      handleRowsPerPageChange,
      pageSize,
      itemsPerPage,
      totalCount,
    ]
  );

  return (
    <Container maxWidth='lg' sx={stylesEntityContainerSx}>
      <Box sx={stylesEntityPagesBox}>
        <Typography variant='h6'>Модерація контенту</Typography>
      </Box>
      <ListTable
        fetchError={fetchError}
        isFetching={isFetching}
        linkEntity='moderation'
        pagination={paginationConfig}
        rows={moderations}
        sortModel={sortModel}
        onModerate={handleModalOpen}
        onSortModelChange={setSortModel}
      />
      <EntityRoutes
        entityPages={MODERATIONS_PAGES}
        handleModalClose={handleModalClose}
      />
    </Container>
  );
}

export default ModerationPage;
