import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import useAuthentication from '@/src/hooks/useAuthentication';

import {
  useFetchCostByCategoriesQuery,
  useFetchCostByEstablishmentsQuery,
  useFetchCostByProductsQuery,
} from '@/src/store/services';

import StatisticsChart from '@/src/components/StatisticsChart';

import {
  stylesEntityStatContainerSx,
  stylesStatisticsPageBox,
  stylesStatisticsPageBoxCriteria,
  stylesStatisticsPageCriteriaSelect,
  stylesStatisticsPagePeriodSelect,
} from '@/src/styles';

function StatisticsPage() {
  const [ago, setAgo] = useState('allTime');
  const [criteria, setCriteria] = useState('byCategories');
  const { authenticatedUser, isAuthenticated } = useAuthentication();

  const creatorUuid = authenticatedUser?.uuid;

  const queriesMap = {
    byCategories: useFetchCostByCategoriesQuery,
    byEstablishments: useFetchCostByEstablishmentsQuery,
    byProducts: useFetchCostByProductsQuery,
  };

  const {
    data: statisticsData,
    isFetching,
    error: fetchError,
  } = queriesMap[criteria](
    { ago, ...(isAuthenticated && { creatorUuid }) },
    { skip: !ago }
  );

  const handleCriteriaChange = useCallback((event) => {
    setCriteria(event.target.value);
  }, []);

  const handleAgoChange = useCallback((event) => {
    setAgo(event.target.value);
  }, []);

  return (
    <Container maxWidth='lg' sx={stylesEntityStatContainerSx}>
      <Box sx={stylesStatisticsPageBox}>
        <Typography variant='h6'>Статистика витрат</Typography>
        <Box sx={stylesStatisticsPageBoxCriteria}>
          <FormControl size='small' sx={stylesStatisticsPageCriteriaSelect}>
            <InputLabel>Критерій</InputLabel>
            <Select
              label='Критерії'
              value={criteria}
              onChange={handleCriteriaChange}
            >
              <MenuItem value='byCategories'>За категоріями</MenuItem>
              <MenuItem value='byEstablishments'>За закладами</MenuItem>
              <MenuItem value='byProducts'>За товарами та послугами</MenuItem>
            </Select>
          </FormControl>

          <FormControl size='small' sx={stylesStatisticsPagePeriodSelect}>
            <InputLabel>Період</InputLabel>
            <Select label='Період' value={ago} onChange={handleAgoChange}>
              <MenuItem value='day'>За останній день</MenuItem>
              <MenuItem value='week'>За останній тиждень</MenuItem>
              <MenuItem value='month'>За останній місяць</MenuItem>
              <MenuItem value='year'>За останній рік</MenuItem>
              <MenuItem value='allTime'>За весь час</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <StatisticsChart
        data={statisticsData}
        fetchError={fetchError}
        isFetching={isFetching}
      />
    </Container>
  );
}

export default StatisticsPage;
