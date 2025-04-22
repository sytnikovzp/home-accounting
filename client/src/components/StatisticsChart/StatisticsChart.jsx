import { useMemo, useState } from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  RadialLinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Doughnut, Pie, PolarArea } from 'react-chartjs-2';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import EqualizerIcon from '@mui/icons-material/Equalizer';
import PieChartIcon from '@mui/icons-material/PieChart';
import RadarIcon from '@mui/icons-material/Radar';

import useDelayedPreloader from '../../hooks/useDelayedPreloader';

import Error from '../Error/Error';

import {
  stylesStatisticsChartBackgroundColor,
  stylesStatisticsChartBorderColor,
  stylesStatisticsChartBox,
  stylesStatisticsChartButton,
  stylesStatisticsChartHoverBackgroundColor,
  stylesStatisticsChartHoverBorderColor,
  stylesStatisticsChartSpinner,
  stylesStatisticsChartStackButton,
  stylesStatisticsChartStackDirection,
} from '../../styles';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function StatisticsChart({ data, fetchError, isFetching }) {
  const [chartType, setChartType] = useState('doughnut');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isPreloaderVisible = useDelayedPreloader(isFetching);

  const chartData = useMemo(() => {
    if (
      !data ||
      data.length === 0 ||
      (data.length === 1 && data[0].result === '0')
    ) {
      return null;
    }

    const titles = data.map((item) => item.title);
    const results = data.map((item) => parseFloat(item.result));

    return {
      datasets: [
        {
          backgroundColor: stylesStatisticsChartBackgroundColor,
          borderColor: stylesStatisticsChartBorderColor,
          borderWidth: 1,
          data: results,
          hoverBackgroundColor: stylesStatisticsChartHoverBackgroundColor,
          hoverBorderColor: stylesStatisticsChartHoverBorderColor,
          label: 'Витрати',
        },
      ],
      labels: titles,
    };
  }, [data]);

  const chartOptions = {
    indexAxis: isMobile ? 'x' : 'y',
    plugins: {
      datalabels: {
        color: 'black',
        display: true,
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage =
            value === 0 ? '0' : ((value / total) * 100).toFixed(0);
          return `${percentage}%`;
        },
      },
      legend: {
        display: chartType !== 'bar',
        position: 'left',
      },
      title: {
        display: false,
        text: 'Статистика витрат',
      },
      tooltip: {
        callbacks: {
          label: (context) => `Вартість: ${context.raw} грн`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const chartHandlers = {
    bar: () => setChartType('bar'),
    doughnut: () => setChartType('doughnut'),
    pie: () => setChartType('pie'),
    polar: () => setChartType('polar'),
  };

  const renderChart = () => {
    switch (chartType) {
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'polar':
        return <PolarArea data={chartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <>
      <Box sx={stylesStatisticsChartBox}>
        {isPreloaderVisible && (
          <Box sx={stylesStatisticsChartSpinner}>
            <CircularProgress color='success' size='3rem' />
          </Box>
        )}

        {!isPreloaderVisible && fetchError && (
          <Error message={fetchError?.data?.message} />
        )}

        {!isPreloaderVisible && !fetchError && !chartData && (
          <Error message='Відсутні дані витрат для відображення за цей період' />
        )}

        {!isPreloaderVisible && !fetchError && chartData && renderChart()}
      </Box>

      <Stack
        direction={stylesStatisticsChartStackDirection}
        justifyContent='center'
        spacing={2}
        sx={stylesStatisticsChartStackButton}
      >
        <Button
          color='default'
          size='small'
          startIcon={<PieChartIcon />}
          sx={stylesStatisticsChartButton}
          variant='contained'
          onClick={chartHandlers.doughnut}
        >
          Донат-діаграма
        </Button>
        <Button
          color='default'
          size='small'
          startIcon={<PieChartIcon />}
          sx={stylesStatisticsChartButton}
          variant='contained'
          onClick={chartHandlers.pie}
        >
          Пірогова діаграма
        </Button>
        <Button
          color='default'
          size='small'
          startIcon={<EqualizerIcon />}
          sx={stylesStatisticsChartButton}
          variant='contained'
          onClick={chartHandlers.bar}
        >
          Бар-діаграма
        </Button>
        <Button
          color='default'
          size='small'
          startIcon={<RadarIcon />}
          sx={stylesStatisticsChartButton}
          variant='contained'
          onClick={chartHandlers.polar}
        >
          Полярна діаграма
        </Button>
      </Stack>
    </>
  );
}

export default StatisticsChart;
