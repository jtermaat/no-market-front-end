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
    const labels = props.data.map(a => a.period); // + ' Day');
    const scoreData = props.data.map(a => (a.score-1.0) * 1000.0);

    // const scoreDataMax = Math.max(...scoreData);
    // const scoreDataMin = Math.min(...scoreData);
    // let scaleMin = 0;
    // if (scoreDataMin < 0) {
    //   scaleMin = Math.max(Math.abs(scoreDataMin), Math.abs(scoreDataMax)) * -1;
    // } 
    const scaleMax = Math.max(25, ...scoreData);
    const scaleMin = Math.min(...scoreData) < 0 ? Math.min(-5, ...scoreData) : 0;


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
              min: scaleMin,
              max: scaleMax,
            },
            x: {
              display: true,
              label: '(Days)',
            }
          }
      };

    const data = {
        labels,
        datasets: [
            {
                label: 'All Period Scores',
                data: scoreData,
                backgroundColor: 'rgba(147, 145, 64, 0.5)',
            },
        ],
    };
    return <Bar options={options} data={data} />;
}

export default PeriodScoresChart;