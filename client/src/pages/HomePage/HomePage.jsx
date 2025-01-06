import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import { DELAY_SHOW_PRELOADER } from '../../constants';
import restController from '../../api/rest/restController';

import Error from '../../components/Error/Error';
import Preloader from '../../components/Preloader/Preloader';
import StatisticsChart from '../../components/StatisticsChart/StatisticsChart';

import {
  stylesHomePageCriteriaSelect,
  stylesHomePagePeriodSelect,
} from '../../styles/pages/homePage';

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [data, setData] = useState([]);
  const [ago, setAgo] = useState('allTime');
  const [criteria, setCriteria] = useState('byCategories');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = { ago };
      let response;
      switch (criteria) {
        case 'byCategories':
          response = await restController.fetchCostByCategories(params);
          break;
        case 'byEstablishments':
          response = await restController.fetchCostByEstablishments(params);
          break;
        case 'byProducts':
          response = await restController.fetchCostByProducts(params);
          break;
        default:
          throw new Error(`Невідомий критерій: ${criteria}`);
      }
      setData(response.data || []);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [ago, criteria]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let timeout;
    if (isLoading) {
      timeout = setTimeout(() => setShowPreloader(true), DELAY_SHOW_PRELOADER);
    } else {
      setShowPreloader(false);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (showPreloader)
    return <Preloader message='Завантаження даних статистики...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <>
      <Box
        alignItems='center'
        display='flex'
        justifyContent='space-between'
        mb={10}
      >
        <Typography variant='h6'>Статистика витрат</Typography>
        <Box display='flex' gap={2}>
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
              <MenuItem value='week'>За неділю</MenuItem>
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
