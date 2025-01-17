import { useEffect, useMemo, useState } from 'react';
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

import useDelayedPreloader from '../../hooks/useDelayedPreloader';

import {
  selectStatisticsData,
  selectStatisticsError,
  selectStatisticsLoading,
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

function HomePage({ currentUser }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = useSelector(selectStatisticsData);
  const isLoading = useSelector(selectStatisticsLoading);
  const errorMessage = useSelector(selectStatisticsError);

  const [ago, setAgo] = useState('allTime');
  const [criteria, setCriteria] = useState('byCategories');

  const pageTitles = useMemo(
    () => ({
      default: 'Моя бухгалтерія',
    }),
    []
  );

  useEffect(() => {
    document.title = pageTitles.default;
  }, [location, pageTitles]);

  useEffect(() => {
    const creatorUuid = currentUser?.uuid || null;
    dispatch(fetchStatisticsByCriteria({ ago, criteria, creatorUuid }));
  }, [dispatch, ago, criteria, currentUser]);

  const showPreloader = useDelayedPreloader(isLoading);

  if (showPreloader) {
    return <Preloader message='Завантаження даних статистики...' />;
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
          Статистика витрат
        </Typography>
        <Box display='flex' flexDirection={stylesEntityPageBox} gap={2}>
          <FormControl size='small' sx={stylesHomePageCriteriaSelect}>
            <InputLabel>Критерій</InputLabel>
            <Select
              label='Критерії'
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
            >
              <MenuItem value='byCategories'>За категоріями</MenuItem>
              <MenuItem value='byEstablishments'>За закладами</MenuItem>
              <MenuItem value='byProducts'>За товарами та послугами</MenuItem>
            </Select>
          </FormControl>

          <FormControl size='small' sx={stylesHomePagePeriodSelect}>
            <InputLabel>Період</InputLabel>
            <Select
              label='Період'
              value={ago}
              onChange={(e) => setAgo(e.target.value)}
            >
              <MenuItem value='day'>За день</MenuItem>
              <MenuItem value='week'>За тиждень</MenuItem>
              <MenuItem value='month'>За місяць</MenuItem>
              <MenuItem value='year'>За рік</MenuItem>
              <MenuItem value='allTime'>За весь час</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <StatisticsChart data={data} />
    </>
  );
}

export default HomePage;
