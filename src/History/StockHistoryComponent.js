import React, { useState, useEffect, useRef } from 'react';
// import StockHistoryChart from './StockHistoryChart';
import Spinner from '../Common/Spinner';
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
} from 'chart.js/auto';
import { Chart, getElementAtEvent } from 'react-chartjs-2';
import Zoom from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';


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

const StockHistoryComponent = (props) => {
  const [currentStock, setCurrentStock] = useState(props.stockName);
  const [currentPeriod, setCurrentPeriod] = useState(props.period);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomMin, setZoomMin] = useState(0);
  const [zoomMax, setZoomMax] = useState(250);
  const [needsMoreData, setNeedsMoreData] = useState(false);
  const [needsData, setNeedsData] = useState(true);
  const [benchmarkData, setBenchmarkData] = useState([]);

  let benchmarkDate = useRef(props.date);
  let benchmarkStockName = useRef(props.stockName);

  const labels = data.map(item => item.date.split('T')[0]);
  const values = data.map(item => item.closePrice);
  const scores = data.map(item => (item.score - 1.0) * 1000.0);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  const bigScreen = useMediaQuery({ query: '(min-width: 800px)' });
  const under700 = useMediaQuery({ query: '(max-width: 700px)' });
  const under500 = useMediaQuery({ query: '(max-width: 575px)' });
  const under420 = useMediaQuery({ query: '(max-width: 440px)' });
  let chartHeightString = "600px";
  let chartFontSize = 12;
  if (under700) {
    chartHeightString = "400px";
    chartFontSize = 10;
    if (under500) {
      chartHeightString = "250px";
      chartFontSize = 8;
      if (under420) {
        chartFontSize = 6;
      }
    }
  }

  const startIndex = labels.indexOf(props.date);

  let product = values[startIndex];
  const outOfContextBenchmarkValues = !benchmarkData ? [] : benchmarkData.slice(0, props.period).map((item, index) => {
    const returnVal = product;
    product = product * item.percentChange;
    return returnVal;
  });
  outOfContextBenchmarkValues.push(product);
  const benchmarkValues = startIndex < 0 ? [] : [...Array(startIndex).fill(null), ...outOfContextBenchmarkValues];

  // *********
  // GRAY ANNOTATIONS
  // *********

  const grayBoundaries = [];
  let inGray = false;
  let inGrayStart = 0;
  for (let i = 0; i < data.length; i++) {
    if (!data[i].currentConstituent.data[0] && !inGray) {
      inGray = true;
      inGrayStart = i;
    } else if (!!data[i].currentConstituent.data[0] && inGray) {
      inGray = false;
      grayBoundaries.push({ left: inGrayStart, right: i });
    }
  }
  if (inGray) {
    grayBoundaries.push({ left: inGrayStart, right: data.length });
  }
  const grayAnnotations = grayBoundaries.map(b => {
    return {
      type: 'box',
      backgroundColor: 'rgba(159, 175, 201, 0.2)',
      borderWidth: 0,
      xMax: b.right,
      xMin: b.left,
      label: {
        drawTime: 'afterDraw',
        display: false,
      }
    };
  });

  // ************
  // END GRAY ANNOTATIONS 
  // ************

  const chartRef = useRef();
  const doubleClickHandler = (event) => {
    const date = labels[getElementAtEvent(chartRef.current, event)[0].index];
    props.datePickHandler(date);
  }

  let maxRef = useRef(400);
  let sizeRef = useRef(250);

  let isWaiting = useRef(false);
  let isStockHistoryError = useRef(false);
  let isPerformanceDataError = useRef(false);

  const loadData = () => {
    if (!isWaiting.current) {
      isStockHistoryError.current = false;
      isWaiting.current = true;
      fetch(' https://6tzw64t9eb.execute-api.us-east-1.amazonaws.com/default/getStockHistory?stockName=' + props.stockName +
        '&period=' + props.period + '&page=' + 0).then(response => {
          return response.json();
        }).then(responseData => {
          setPage(1);
          setData([...responseData.reverse()]);
          setIsLoading(false);
          props.onDoneLoadingHistory();
          setNeedsData(false);
          isWaiting.current = false;
          maxRef.current = 400;
          sizeRef.current = 250;
          chartRef.current.zoomScale('x', { min: 250, max: 400 }, 'default');
        }).catch(error => {
          setIsLoading(false);
          setNeedsData(false);
          isWaiting.current = false;
          isStockHistoryError.current = true;

        });
    }
  }

  const loadBenchmarkData = () => {
    isPerformanceDataError.current = false;
    fetch('https://0w55vqldgh.execute-api.us-east-1.amazonaws.com/default/getPerformanceForDate?period=1&numPicks=5000&date=' + props.date).then(response => {
      return response.json();
    }).then(responseData => {
      if (responseData.length == 0) {
        isPerformanceDataError.current = true;
      }
      setBenchmarkData([...responseData]);
    }).catch(error => {
      isPerformanceDataError.current = true;
    });
  }

  const loadMoreData = (chart, min, max) => {
    if (!needsMoreData) {
      setNeedsMoreData(true);
    }
  };

  useEffect(() => {
    if (needsMoreData && !isWaiting.current) {
      isStockHistoryError.current = false;
      isWaiting.current = true;
      fetch(' https://6tzw64t9eb.execute-api.us-east-1.amazonaws.com/default/getStockHistory?stockName=' + props.stockName +
        '&period=' + props.period + '&page=' + page).then(response => {
          return response.json();
        }).then(responseData => {
          setPage(page + 1);
          setData([...responseData.reverse(), ...data]);
          setNeedsMoreData(false);
          maxRef.current = maxRef.current + responseData.length;
          isWaiting.current = false;
        }).catch(e => {
          isWaiting.current = false;
          isStockHistoryError.current = true;
        });
    }
    chartRef.current.zoomScale('x', { min: (maxRef.current - sizeRef.current), max: maxRef.current }, 'default');

    if (needsData) {
      loadData();
    }

    if (props.date !== benchmarkDate.current ||
      props.stockName !== benchmarkStockName.current ||
      (benchmarkData.length == 0 && startIndex < labels.length - 1 && !isPerformanceDataError.current)) {
      benchmarkStockName.current = props.stockName;
      benchmarkDate.current = props.date;
      isPerformanceDataError.current = false;
      loadBenchmarkData();
    }

  });

  if (currentStock !== props.stockName || currentPeriod !== props.period) {
    setCurrentStock(props.stockName);
    setCurrentPeriod(props.period);
    setNeedsData(true);
    loadData();
    setPage(0);
    setIsLoading(true);
    props.onStartedLoadingHistory();
  }

  const zoomCompleteHandler = (chart) => {
    const { min, max } = chart.chart.scales.x;
    maxRef.current = max;
    sizeRef.current = max - min;
    if (min < 200 && !isLoading) {
      loadMoreData();
    }
  };


  const zoomOptions = {
    limits: {
      x: { min: 'original', max: 'original', minRange: 50 },
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
    borderColor: 'rgb(145, 138, 1)',
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
    backgroundColor: 'rgba(145, 138, 1, 0.2)',
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

  const annotations = !isLoading ? [annotation, annotation2, ...grayAnnotations] : [];

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
          maxRotation: 0,
          font: {
            size: chartFontSize
          }
        },
      },
      y: {

        type: 'linear',
        position: 'left',
        ticks: {
          font: {
            size: chartFontSize
          }
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        min: minScore,
        max: maxScore,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: chartFontSize
          }
        }
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Close Price',
        data: values,
        borderColor: 'rgba(64, 66, 147, 0.75)',
        backgroundColor: 'rgba(64, 66, 147, 0.75)',
        borderWidth: under700 ? 1 : 2,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: props.period + '-Day Score',
        data: scores,
        borderColor: 'rgb(64, 147, 103)',
        backgroundColor: 'rgba(64, 147, 103, 0.5)',
        yAxisID: 'y1',
      },
      {
        type: 'line',
        label: `${props.period}-Day Period starting ${props.date}`,
        data: [],
        borderColor: 'rgb(115, 84, 37)',
        backgroundColor: 'rgba(115, 84, 37, 0.2)',
        borderDash: [10, 2],
        borderWidth: under700 ? 1 : 2,
        yAxisID: 'y',
      },
    ],
  };

  if (startIndex < labels.length - 1) {
    chartData.datasets.push({
      type: 'line',
      label: 'All Stocks Price Movement',
      data: benchmarkValues,
      borderColor: 'rgba(131, 24, 80, 0.75)',
      backgroundColor: 'rgba(256,256,256, 0.75)',
      borderDash: [10, 2],
      borderWidth: under700 ? 1 : 2,
      yAxisID: 'y'
    });
  }


  return <Chart ref={chartRef} options={options} data={chartData} onDoubleClick={doubleClickHandler} />;


}

export default StockHistoryComponent;