import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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

const PeriodScoresChart = (props) => {
    const labels = props.data.map(a => a.period + ' Day');
    const scoreData = props.data.map(a => a.score);

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
          },
        },
        scales: {
            y: {
              type: 'linear',
              display: true,
              min: Math.min(0.99, ...scoreData),
              max: Math.max(1.01, ...scoreData)
            },
          }
      };

    const data = {
        labels,
        datasets: [
            {
                label: 'All Period Scores',
                data: scoreData,
                backgroundColor: 'rgba(113, 103, 46, 0.5)',
            },
        ],
    };
    return <Bar options={options} data={data} />;
}

export default PeriodScoresChart;