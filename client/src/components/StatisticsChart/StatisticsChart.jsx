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
import { Bar, Doughnut, Pie, PolarArea } from 'react-chartjs-2';
import { Box, Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Radar as RadarIcon,
} from '@mui/icons-material';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
  stylesStatisticsChartBackgroundColor,
  stylesStatisticsChartBorderColor,
  stylesStatisticsChartBox,
  stylesStatisticsChartButton,
  stylesStatisticsChartHoverBackgroundColor,
  stylesStatisticsChartHoverBorderColor,
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

function StatisticsChart({ data }) {
  const [chartType, setChartType] = useState('doughnut');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const titles = data.map((item) => item.title);
    const results = data.map((item) => parseFloat(item.result));

    return {
      labels: titles,
      datasets: [
        {
          label: 'Витрати',
          data: results,
          backgroundColor: stylesStatisticsChartBackgroundColor,
          borderColor: stylesStatisticsChartBorderColor,
          borderWidth: 1,
          hoverBackgroundColor: stylesStatisticsChartHoverBackgroundColor,
          hoverBorderColor: stylesStatisticsChartHoverBorderColor,
        },
      ],
    };
  }, [data]);

  if (!chartData) return <p>Немає даних для відображення.</p>;

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

  const chartOptions = {
    indexAxis: isMobile ? 'x' : 'y',
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: 'Статистика витрат',
      },
      tooltip: {
        callbacks: {
          label: (context) => `Вартість: ${context.raw} грн`,
        },
      },
      legend: {
        display: chartType !== 'bar',
        position: 'left',
      },
      datalabels: {
        display: true,
        color: 'black',
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          return `${percentage}%`;
        },
      },
    },
  };

  return (
    <>
      <Box sx={stylesStatisticsChartBox}>{renderChart()}</Box>
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
          onClick={() => setChartType('doughnut')}
        >
          Донат-діаграма
        </Button>
        <Button
          color='default'
          size='small'
          startIcon={<PieChartIcon />}
          sx={stylesStatisticsChartButton}
          variant='contained'
          onClick={() => setChartType('pie')}
        >
          Пірогова діаграма
        </Button>
        <Button
          color='default'
          size='small'
          startIcon={<BarChartIcon />}
          sx={stylesStatisticsChartButton}
          variant='contained'
          onClick={() => setChartType('bar')}
        >
          Бар-діаграма
        </Button>
        <Button
          color='default'
          size='small'
          startIcon={<RadarIcon />}
          sx={stylesStatisticsChartButton}
          variant='contained'
          onClick={() => setChartType('polar')}
        >
          Полярна діаграма
        </Button>
      </Stack>
    </>
  );
}

export default StatisticsChart;
