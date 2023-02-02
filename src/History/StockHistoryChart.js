import React, { useState, useRef, useEffect } from 'react';
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
    const scores = props.data.map(item => (item.score-1.0)*1000.0);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    let maxRef = useRef(400);
    let sizeRef = useRef(250);
    let dataSizeRef = useRef(400);

    let lastPeriod = useRef('0');
    let lastStock = useRef('');

    let initialized = useRef(false);

    const zoomCompleteHandler = (chart) => {
        const {min, max} = chart.chart.scales.x;
        console.log('min: ' + min + ', max: ' + max);
        console.log("Setting max to " + max);
        console.log("Setting size to " + (max-min));
        maxRef.current=max;
        sizeRef.current=max-min;
      // if (min == 0 && !props.isLoading) {
        if (min < 200 && !props.isLoading) {
          props.loadMoreDataHandler(chart, min, max);
        }
      
    };

    // const chartRef = React.createRef();
    const chartRef = useRef();
    const doubleClickHandler = (event) => {
      // console.log(getElementAtEvent(chartRef.current, event));
      const date = labels[getElementAtEvent(chartRef.current, event)[0].index];
      props.datePickHandler(date);
    }

    useEffect(() => {
      // if (!initialized.current) {
      //   maxRef.current = 400;
      //   sizeRef.current = 250;
      //   chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current), max: maxRef.current}, 'default');
      //   initialized.current = true;
      // }
      // if (props.data.length < dataSizeRef.current) {
      //   maxRef.current = 400;
      //   sizeRef.current = 250;
      //   chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current), max: maxRef.current}, 'default');
      // } else {
        // if (props.data.length >= dataSizeRef.current) {
          if (lastPeriod.current != props.period || lastStock.current != props.stockName) {
            console.log("Setting normal bounds.");
            maxRef.current = 400;
            sizeRef.current = 250;
            // dataSizeRef.current = props.data.length;
            // dataSizeRef.current = 10000;
            chartRef.current.zoomScale('x', {min: 150, max: 400}, 'default');
            // dataSizeRef.current = props.data.length;
            lastPeriod.current = props.period;
            lastStock.current = props.stockName;
            dataSizeRef.current = props.data.length;
          } else { //if (props.data.length >= dataSizeRef.current) {
            const dataGrowthSize = props.data.length - dataSizeRef.current;
            dataSizeRef.current = props.data.length;
            console.log("data growth size: " + dataGrowthSize);
            if (dataGrowthSize >= 0) {
              console.log('maxRef.current: ' + maxRef.current);
              console.log('sizeRef.current: ' + sizeRef.current);
              chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current)+dataGrowthSize, max: maxRef.current+dataGrowthSize}, 'default');
            }
            // dataSizeRef.current = props.data.length;
          }
        //   const dataGrowthSize = props.data.length - dataSizeRef.current;
        //   chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current)+dataGrowthSize, max: maxRef.current+dataGrowthSize}, 'default');
        //   dataSizeRef.current = props.data.length;
        // } else if (props.data.length < dataSizeRef.current) {
        //   console.log("Hit case 2");
        //   maxRef.current = 400;
        //   sizeRef.current = 250;
        //   chartRef.current.zoomScale('x', {min: 150, max: 400}, 'default');
        //   dataSizeRef.current = props.data.length;
        // }
        // const dataGrowthSize = props.data.length - dataSizeRef.current;
        //   chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current)+dataGrowthSize, max: maxRef.current+dataGrowthSize}, 'default');
      // }
      // dataSizeRef.current = props.data.length;
      // if (props.data.length > 0) {
      //   dataSizeRef.current = props.data.length;
      // }
    });

    const zoomOptions = {
      limits: {
        // x: {min: !!props.zoomMin ? props.zoomMin : 'originial', max: !!props.zoomMax ? props.zoomMax : 'original', minRange: 0},
        x: {min: 'original', max: 'original', minRange: 50},
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
          type: "line",
          mode: "vertical",
          scaleID: "x",
          value: props.date,
          borderColor: 'rgb(147, 64, 108)',
          borderDash: [6, 6],
          borderWidth: 2,
          label: {
            content: "TODAY",
            enabled: true,
            position: "top"
          }
    };

    const annotation2 = {
      type: 'box',
      backgroundColor: 'rgba(147, 64, 108, 0.2)',
      borderWidth: 0,
      xMax: Number(labels.indexOf(props.date)) + Number(props.period),
      xMin: labels.indexOf(props.date),
      label: {
        drawTime: 'afterDraw',
        display: false,
        content: `${props.period} Market Days`,
        position: {
          x: 'center',
          y: 'start'
        }
      }
    };

    const annotations = !props.isLoading ? [annotation, annotation2] : [];

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
            annotations: annotations
          },
          tooltip: {
            callbacks: {
              beforeTitle: function () {
                return "Zoom and pan | Double click to jump to date";
              }
            }
          }
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
        borderColor: 'rgb(64, 66, 147)',
        backgroundColor: 'rgb(64, 66, 147)',
        yAxisID: 'y',
        },
        {
        type: 'bar',
        label: props.period + '-Day Score',
        data: scores,
        borderColor: 'rgb(64, 147, 103)',
        backgroundColor: 'rgba(64, 147, 103, 0.5)',
        yAxisID: 'y1',
        }
      ],
};

      return <Chart ref={chartRef} options={options} data={data} onDoubleClick={doubleClickHandler} />;
}



export default StockHistoryChart;
