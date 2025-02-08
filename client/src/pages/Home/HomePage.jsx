import { useState } from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import useAuthUser from '../../hooks/useAuthUser';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';

import {
  useFetchCostByCategoriesQuery,
  useFetchCostByEstablishmentsQuery,
  useFetchCostByProductsQuery,
} from '../../store/services';

import Error from '../../components/Error/Error';
import Preloader from '../../components/Preloader/Preloader';
import StatisticsChart from '../../components/StatisticsChart/StatisticsChart';

import {
  stylesEntityPageBox,
  stylesEntityPageTypography,
  stylesHomePageCriteriaSelect,
  stylesHomePagePeriodSelect,
} from '../../styles';

function HomePage() {
  const [ago, setAgo] = useState('allTime');
  const [criteria, setCriteria] = useState('byCategories');
  const { isFetchingUser, authenticatedUser, isAuthenticated } = useAuthUser();

  const creatorUuid = authenticatedUser?.uuid;

  const queriesMap = {
    byCategories: useFetchCostByCategoriesQuery,
    byEstablishments: useFetchCostByEstablishmentsQuery,
    byProducts: useFetchCostByProductsQuery,
  };

  const {
    data: statistics,
    isFetching: isFetchingStatistics,
    error: fetchStatisticsError,
  } = queriesMap[criteria](
    { ago, ...(isAuthenticated && { creatorUuid }) },
    { skip: !ago }
  );

  const handleCriteriaChange = (event) => setCriteria(event.target.value);

  const handleAgoChange = (event) => setAgo(event.target.value);

  const isPreloaderVisible = useDelayedPreloader(
    isFetchingStatistics || isFetchingUser
  );

  if (isPreloaderVisible) {
    return <Preloader message='Завантаження даних статистики...' />;
  }

  if (fetchStatisticsError) {
    return <Error error={fetchStatisticsError?.data?.message} />;
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
          Статистика витрат
        </Typography>
        <Box display='flex' flexDirection={stylesEntityPageBox} gap={2}>
          <FormControl size='small' sx={stylesHomePageCriteriaSelect}>
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

          <FormControl size='small' sx={stylesHomePagePeriodSelect}>
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
      <StatisticsChart data={statistics} />
    </>
  );
}

export default HomePage;
