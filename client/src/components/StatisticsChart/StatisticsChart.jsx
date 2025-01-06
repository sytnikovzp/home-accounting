import { useMemo } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StatisticsChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const titles = data.map((item) => item.title);
    const results = data.map((item) => parseFloat(item.result));

    return {
      labels: titles,
      datasets: [
        {
          label: 'Вартість',
          data: results,
          backgroundColor: ['#4caf50', '#66bb6a', '#81c784', '#a5d6a7'],
          borderColor: '#2e7d32',
          borderWidth: 1,
          hoverBackgroundColor: '#2e7d32',
          hoverBorderColor: '#1b5e20',
        },
      ],
    };
  }, [data]);

  if (!chartData) return <p>Немає даних для відображення.</p>;

  return (
    <Bar
      data={chartData}
      options={{
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
        },
      }}
    />
  );
}

export default StatisticsChart;
