import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import Zoom from 'chartjs-plugin-zoom';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Zoom,
);

const StockHistoryChart = (props) => {
    const labels = props.data.map(item => item.date);
    const values = props.data.map(item => item.closePrice);
    const scores = props.data.map(item => item.score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    const zoomOptions = {
      limits: {
        x: {min: 'original', max: 'original', minRange: 0},
      },
      pan: {
        enabled: true,
        mode: 'x',
        // onPanComplete: props.zoomChangeHandler,
        drag: {
          enabled: true
        }
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true
        },
        mode: 'x',
        // onZoomComplete: props.zoomChangeHandler
      }
    };

    const options = {
        responsive: true,
        animation: {
          duration: 0
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: props.stockName,
          },
          zoom: zoomOptions,
        },
        elements: {
          point: {
            radius: 0,
          },
          line: {
            tension: 0.01,
          }
        },
        zoom: {
          enabled: true,
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
        scales: {
            x: {
              position: 'bottom',
              ticks: {
                autoSkip: true,
                autoSkipPadding: 100,
                maxRotation: 0
              },
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              min: minScore,
              max: maxScore,
              grid: {
                drawOnChartArea: false,
              },
            },
          }
      };

      const data = {
      labels,
      datasets: [
        {
        type: 'line',
        label: 'Close Price',
        data: values,
        borderColor: 'rgb(96, 115, 173)',
        backgroundColor: 'rgb(96, 154, 173)',
        yAxisID: 'y',
        },
        {
        type: 'bar',
        label: props.period + '-Day Score',
        data: scores,
        borderColor: 'rgb(115, 173, 96)',
        backgroundColor: 'rgba(115, 173, 96, 0.5)',
        yAxisID: 'y1',
        }
      ],
};

      return <Chart options={options} data={data} />;
}



export default StockHistoryChart;
