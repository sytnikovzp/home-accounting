import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import { pageTitles } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import usePageTitle from '../../hooks/usePageTitle';
import {
  useFetchCostByCategoriesQuery,
  useFetchCostByEstablishmentsQuery,
  useFetchCostByProductsQuery,
  useFetchUserProfileQuery,
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

const { HOME_PAGE_TITLES } = pageTitles;

function HomePage() {
  const [ago, setAgo] = useState('allTime');
  const [criteria, setCriteria] = useState('byCategories');

  const location = useLocation();

  // const {
  //   data: currentUser,
  //   isLoading: isFetchingUser,
  //   error: fetchUserError,
  // } = useFetchUserProfileQuery();

  // const creatorUuid = currentUser?.uuid;

  const queriesMap = {
    byCategories: useFetchCostByCategoriesQuery,
    byEstablishments: useFetchCostByEstablishmentsQuery,
    byProducts: useFetchCostByProductsQuery,
  };

  const {
    data: statistics,
    isLoading: isFetchingStatistics,
    error: fetchStatisticsError,
  } = queriesMap[criteria](
    // { ago, ...(creatorUuid && { creatorUuid }) },
    { ago },
    { skip: !ago }
  );

  const showPreloader = useDelayedPreloader(
    isFetchingStatistics
    // || isFetchingUser
  );

  usePageTitle(location, HOME_PAGE_TITLES);

  const handleCriteriaChange = useCallback((e) => {
    setCriteria(e.target.value);
  }, []);

  const handleAgoChange = useCallback((e) => {
    setAgo(e.target.value);
  }, []);

  if (showPreloader) {
    return <Preloader message='Завантаження даних статистики...' />;
  }

  // if (fetchUserError) {
  //   return <Error error={fetchUserError?.data?.message} />;
  // }

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
