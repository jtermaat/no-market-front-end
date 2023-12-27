import React, { useState, useRef, useEffect, memo } from 'react';
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
import standardDeviation from './StandardDeviation';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useMediaQuery } from 'react-responsive';
import UrlFetcher from '../Common/UrlFetcher';


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

ChartJS.register(annotationPlugin);

const PerformanceChart = (props) => {

  const under700 = useMediaQuery({ query: '(max-width: 700px)' });
  const under550 = useMediaQuery({ query: '(max-width: 550px)' });
  const under450 = useMediaQuery({ query: '(max-width: 450px)' });

  let chartFontSize = 14;
  if (under700) {
    chartFontSize = 12;
  }
  if (under550) {
    chartFontSize = 10;
  }
  if (under450) {
    chartFontSize = 8;
  }

  const [rawData, setRawData] = useState([]);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(false);
  const [needsMoreData, setNeedsMoreData] = useState(false);
  const [loadingMoreData, setLoadingMoreData] = useState(false);
  let loadingMoreRef = useRef(false);


  const DEFAULT_SIZE = 200;
  const DEFAULT_MAX = 400 //-props.period;
  const DEFAULT_LOAD_THRESH = 200;

  let needsData = useRef(true);
  let isWaiting = useRef(false);
  let maxRef = useRef(DEFAULT_MAX);
  let sizeRef = useRef(DEFAULT_SIZE);
  let dataSizeRef = useRef(10000);

  const [baselineRawData, setBaselineRawData] = useState([]);
  const labels = rawData.map(item => item.date.split("T")[0]);
  const percentChanges = rawData.map(item => item.percentChange);
  const baselinePercentChanges = baselineRawData.map(item => item.percentChange);

  const prepProcessedData = (min, max, pctChanges, name) => {
    let runningProduct = 1.0;
    const returnData = [];
    const deviationData = [];
    for (let i = 0; i < pctChanges.length; i++) {
      if (i < min) {
        returnData.push(0.0);
      } else if (i == min) {
        runningProduct = 1.0;
        const value = (runningProduct - 1.0) * 100.0;
        const deviationValue = runningProduct * 100.0;
        runningProduct = runningProduct * pctChanges[i];
        returnData.push(value);
        deviationData.push(deviationValue);
      } else if (i <= max) {
        const value = (runningProduct - 1.0) * 100.0;
        const deviationValue = runningProduct * 100.0;
        runningProduct = runningProduct * pctChanges[i];
        returnData.push(value);
        deviationData.push(deviationValue);
      }
    }
    props.updateDeviationData({ gain: deviationData[deviationData.length - 1] - deviationData[0], deviation: standardDeviation(deviationData), name: name });
    return returnData;
  }

  const processedData = prepProcessedData(maxRef.current - sizeRef.current, maxRef.current, percentChanges, 'model');
  const processedBaselineData = prepProcessedData(maxRef.current - sizeRef.current, maxRef.current, baselinePercentChanges, 'baseline');


  const chartRef = useRef();
  const clickHandler = (event) => {
    const element = getElementAtEvent(chartRef.current, event)[0];
    if (!!element) {
      const date = labels[element.index];
      props.datePickHandler(date);
    }
  }





  const loadData = () => {
    if (!isWaiting.current) {
      isWaiting.current = true;
      props.onStartedLoadingPerformance();
      const promise1 = fetch(UrlFetcher.getPerformanceUrl(props.period, props.numPicks, 0)).then(response => {
          return response.json();
        });
      const promise2 = fetch(UrlFetcher.getPerformanceUrl(1, 5000, 0)).then(response => {
        return response.json();
      });
      Promise.all([promise1, promise2]).then(([responseData1, responseData2]) => {
        setRawData(responseData1.reverse());
        setBaselineRawData(responseData2.reverse());
        setPage(1);
        setError(false);
        props.onDoneLoadingPerformance();
        needsData.current = false;
        isWaiting.current = false;
        maxRef.current = DEFAULT_MAX;
        sizeRef.current = DEFAULT_SIZE;
        dataSizeRef.current = responseData1.length;
      }).catch(error => {
        setError(true);
        props.onDoneLoadingPerformance();
        needsData.current = false;
        isWaiting.current = false;
      });
    }
  }

  useEffect(() => {
    if (needsMoreData) {
      loadMoreData();
    }


    if (rawData.length < dataSizeRef.current) {
      maxRef.current = DEFAULT_MAX;
      sizeRef.current = DEFAULT_SIZE;
    } else if (rawData.length > dataSizeRef.current) {
      const dataGrowthSize = rawData.length - dataSizeRef.current;
      if (!!chartRef.current) {
        const percentChanges = rawData.map(item => item.percentChange);
        const baselinePercentChanges = baselineRawData.map(item => item.percentChange);
        const min = Number(maxRef.current - sizeRef.current) + Number(dataGrowthSize);
        const max = Number(maxRef.current) + Number(dataGrowthSize);
        chartRef.current.data.datasets[0].data = prepProcessedData(min, max, percentChanges, 'model');
        chartRef.current.data.datasets[1].data = prepProcessedData(min, max, baselinePercentChanges, 'baseline');
        chartRef.current.zoomScale('x', { min: (maxRef.current - sizeRef.current) + dataGrowthSize, max: maxRef.current + dataGrowthSize }, 'default');
      }
    } else {
      const percentChanges = rawData.map(item => item.percentChange);
      const baselinePercentChanges = baselineRawData.map(item => item.percentChange);
      chartRef.current.zoomScale('x', { min: (maxRef.current - sizeRef.current), max: maxRef.current }, 'default');
    }

    dataSizeRef.current = rawData.length;

  });

  const loadMoreData = (chart) => {
    if (!loadingMoreRef.current) {
      loadingMoreRef.current = true;
      const promise1 = fetch(UrlFetcher.getPerformanceUrl(props.period, props.numPicks, page)).then(response => {

          return response.json();
        });
      const promise2 = fetch(UrlFetcher.getPerformanceUrl(1, 5000, page)).then(response => {
          return response.json();
        });
      Promise.all([promise1, promise2]).then(([responseData1, responseData2]) => {

        setRawData([...responseData1.reverse(), ...rawData]);
        setBaselineRawData([...responseData2.reverse(), ...baselineRawData]);

        setPage(page + 1);
        setNeedsMoreData(false);
        loadingMoreRef.current = false;
      }).catch(error => {
        setNeedsMoreData(false);
        loadingMoreRef.current = false;
        setError(true);
      });
    }
  }


  if ((rawData.length === 0 && !error) || rawData[0].numPicks != props.numPicks || rawData[0].period != props.period) {
    loadData();
  }


  const zoomCompleteHandler = (chart) => {
    const { min, max } = chart.chart.scales.x;

    maxRef.current = max;
    sizeRef.current = max - min;
    if (min < DEFAULT_LOAD_THRESH && !needsMoreData) {
      setNeedsMoreData(true);
    }


    const percentChanges = rawData.map(item => item.percentChange);
    const baselinePercentChanges = baselineRawData.map(item => item.percentChange);

    chart.chart.data.datasets[0].data = prepProcessedData(min, max, percentChanges, 'model');
    chart.chart.data.datasets[1].data = prepProcessedData(min, max, baselinePercentChanges, 'baseline');
    chart.chart.stop(); // make sure animations are not running
    chart.chart.update('none');
  };

  const zoomOptions = {
    limits: {
      x: { min: 'original', max: 'original', minRange: 0 },
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
    value: labels.indexOf(props.date),
    borderColor: 'rgb(145, 138, 1)',
    borderDash: [6, 6],
    borderWidth: 2,
    label: {
      content: "TODAY",
      enabled: true,
      position: "top"
    }
  };


  const annotations = [annotation];

  const options = {
    responsive: true,
    animation: {
      duration: 0
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: chartFontSize
          }
        }
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
            return "Zoom and pan | Click a node to jump to date";
          }
        }
      }
    },
    elements: {
      point: {
        radius: under450 ? 0.7 : under550 ? 1.0 : 2.0,
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
          maxRotation: 0,
          font: {
            size: chartFontSize
          }
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          font: {
            size: chartFontSize
          }
        }
      },
      y1: {
        type: 'linear',
        display: false,
        position: 'right',
        ticks: {
          font: {
            size: chartFontSize
          }
        }
      },
    }
  };

  const data = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Cumulative % Change for top ' + props.numPicks + ' stocks',
        data: processedData,
        borderColor: 'rgba(64, 66, 147, 0.75)',
        borderWidth: under700 ? 1 : 2,
        backgroundColor: 'rgba(64, 66, 147, 0.75)',
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Cumulative % Change for all stocks',
        data: processedBaselineData,
        borderColor: 'rgba(116, 14, 14, 0.75)',
        borderWidth: under700 ? 1 : 2,
        backgroundColor: 'rgba(116, 14, 14, 0.75)',
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: props.date,
        data: [],
        borderColor: 'rgb(115, 84, 37)',
        borderWidth: under700 ? 1 : 2,
        backgroundColor: 'rgba(115, 84, 37, 0.2)',
        borderDash: [10, 2],
        yAxisID: 'y',
      },
    ],
  };

  return <Chart ref={chartRef} options={options} data={data} onClick={clickHandler} />;
}



export default memo(PerformanceChart, (prevProps, nextProps) => {
  if (prevProps.period === nextProps.period && prevProps.numPicks === nextProps.numPicks && prevProps.date === nextProps.date) {
    return true;
  }
  return false;
});
