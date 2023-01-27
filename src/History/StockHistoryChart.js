import React, { useState, useRef } from 'react';
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
import { Chart, getElementAtEvent } from 'react-chartjs-2';
import Zoom from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';


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
  annotationPlugin,
);

// ChartJS.register(annotationPlugin);

const StockHistoryChart = (props) => {
    const labels = props.data.map(item => item.date);
    const values = props.data.map(item => item.closePrice);
    const scores = props.data.map(item => item.score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    const zoomCompleteHandler = (chart) => {
      const {min, max} = chart.chart.scales.x;
      if (min == 0 && !props.isLoading) {
        props.loadMoreDataHandler(chart, min, max);
      }
    };

    const chartRef = useRef();
    const doubleClickHandler = (event) => {
      // console.log(getElementAtEvent(chartRef.current, event));
      const date = labels[getElementAtEvent(chartRef.current, event)[0].index];
      props.datePickHandler(date);
    }

    const zoomOptions = {
      limits: {
        // x: {min: !!props.zoomMin ? props.zoomMin : 'originial', max: !!props.zoomMax ? props.zoomMax : 'original', minRange: 0},
        x: {min: 'original', max: 'original', minRange: 0},
      },
      pan: {
        enabled: true,
        mode: 'x',
        onPanComplete: zoomCompleteHandler,
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
        onZoomComplete: zoomCompleteHandler
      }
    };

    const annotation = {
      // annotations: [
      //   {
          type: "line",
          mode: "vertical",
          scaleID: "x",
          value: props.date,
          borderColor: 'rgb(79, 50, 52, 0.5)',
          borderDash: [6, 6],
          borderWidth: 2,
          label: {
            content: "TODAY",
            enabled: true,
            position: "top"
          }
      //   }
      // ]
    };

    const options = {
      // annotation: ,
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
          annotation: {
            annotations: {
              annotation
            },
          },
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
              id: 'x-id',
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
          },
      };

      const data = {
      labels,
      datasets: [
        {
        type: 'line',
        label: 'Close Price',
        data: values,
        borderColor: 'rgb(96, 115, 173)',
        backgroundColor: 'rgb(96, 115, 173)',
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

      return <Chart ref={chartRef} options={options} data={data} onDoubleClick={doubleClickHandler} />;
}



export default StockHistoryChart;
