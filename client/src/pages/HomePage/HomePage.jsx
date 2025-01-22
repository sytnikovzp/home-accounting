import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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

import { selectAuthUser } from '../../store/selectors/authSelectors';
import {
  selectStatistics,
  selectStatisticsError,
  selectStatisticsIsLoading,
} from '../../store/selectors/statisticsSelectors';
import { fetchStatisticsByCriteria } from '../../store/thunks/statisticsThunks';

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

  const dispatch = useDispatch();
  const location = useLocation();

  const currentUser = useSelector(selectAuthUser);
  const statistics = useSelector(selectStatistics);
  const isLoading = useSelector(selectStatisticsIsLoading);
  const error = useSelector(selectStatisticsError);

  useEffect(() => {
    const creatorUuid = currentUser?.uuid || null;
    dispatch(fetchStatisticsByCriteria({ ago, criteria, creatorUuid }));
  }, [ago, criteria, currentUser?.uuid, dispatch]);

  usePageTitle(location, HOME_PAGE_TITLES);

  const handleCriteriaChange = useCallback((e) => {
    setCriteria(e.target.value);
  }, []);

  const handleAgoChange = useCallback((e) => {
    setAgo(e.target.value);
  }, []);

  const showPreloader = useDelayedPreloader(isLoading);

  if (showPreloader) {
    return <Preloader message='Завантаження даних статистики...' />;
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
              <MenuItem value='day'>За день</MenuItem>
              <MenuItem value='week'>За тиждень</MenuItem>
              <MenuItem value='month'>За місяць</MenuItem>
              <MenuItem value='year'>За рік</MenuItem>
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
