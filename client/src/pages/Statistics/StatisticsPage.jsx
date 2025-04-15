import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import useAuthUser from '../../hooks/useAuthUser';

import {
  useFetchCostByCategoriesQuery,
  useFetchCostByEstablishmentsQuery,
  useFetchCostByProductsQuery,
} from '../../store/services';

import StatisticsChart from '../../components/StatisticsChart/StatisticsChart';

import {
  stylesStatisticsPageCriteriaSelect,
  stylesStatisticsPagePeriodSelect,
} from '../../styles';

function StatisticsPage() {
  const [ago, setAgo] = useState('allTime');
  const [criteria, setCriteria] = useState('byCategories');
  const { authenticatedUser, isAuthenticated } = useAuthUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleCriteriaChange = (event) => setCriteria(event.target.value);

  const handleAgoChange = (event) => setAgo(event.target.value);

  return (
    <Container maxWidth='lg' sx={{ py: 2 }}>
      <Box
        alignItems='center'
        display='flex'
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent='space-between'
        mb={2}
      >
        <Typography variant='h6'>Статистика витрат</Typography>
        <Box display='flex' flexDirection={isMobile ? 'column' : 'row'} gap={2}>
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
        isMobile={isMobile}
      />
    </Container>
  );
}

export default StatisticsPage;
