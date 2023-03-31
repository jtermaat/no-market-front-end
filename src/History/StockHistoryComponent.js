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
} from 'chart.js';
import { Chart, getElementAtEvent } from 'react-chartjs-2';
import Zoom from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';


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


    // const [rawData, setRawData] = useState([]);

    const labels = data.map(item => item.date.split('T')[0]);
    const values = data.map(item => item.closePrice);
    const scores = data.map(item => (item.score-1.0)*1000.0);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    const startIndex = labels.indexOf(props.date);
    
    let product = values[startIndex];
    const outOfContextBenchmarkValues = !benchmarkData ? [] : benchmarkData.slice(0, props.period).map((item, index) => {
        const returnVal = product;
        product = product * item.percentChange;
        return returnVal;
    });
    outOfContextBenchmarkValues.push(product);
    console.log('out of context benchmark values: ' + outOfContextBenchmarkValues);
    const benchmarkValues = startIndex < 0 ? [] : [...Array(startIndex).fill(null), ...outOfContextBenchmarkValues];
    console.log("benchmark values length : " + benchmarkValues.length);

    // *********
    // GRAY ANNOTATIONS
    // *********

    const grayBoundaries = [];
    let inGray = false;
    let inGrayStart = 0;
    for (let i = 0;i<data.length;i++) {
        if (!data[i].currentConstituent.data[0] && !inGray) {
            inGray = true;
            inGrayStart = i;
        } else if (!!data[i].currentConstituent.data[0] && inGray) {
            inGray = false;
            grayBoundaries.push({left:inGrayStart, right:i});
        }
    }
    if (inGray) {
        grayBoundaries.push({left:inGrayStart, right:data.length});
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
        // console.log(getElementAtEvent(chartRef.current, event));
        const date = labels[getElementAtEvent(chartRef.current, event)[0].index];
        props.datePickHandler(date);
      }

    let maxRef = useRef(400);
    let sizeRef = useRef(250);
    // let dataSizeRef = useRef(400);

    let isWaiting = useRef(false);

    const loadData = () => {
        // setNeedsData(false);
        // setIsLoading(true);
        if (!isWaiting.current) {
            isWaiting.current = true;
            // fetch('http://localhost:8080/prediction/' + props.stockName + '/' + props.period + '/' + 0).then(response => {
              fetch(' https://6tzw64t9eb.execute-api.us-east-1.amazonaws.com/default/getStockHistory?stockName=' + props.stockName + 
                      '&period=' + props.period + '&page=' + 0).then(response => {
                return response.json();
            }).then(responseData => {
                setPage(1);
                setData([...responseData.reverse()]);
                setIsLoading(false);
                // setNeedsData(false);
                props.onDoneLoadingHistory();
                setNeedsData(false);
                isWaiting.current = false;
                maxRef.current = 400;
                sizeRef.current = 250;
                chartRef.current.zoomScale('x', {min: 250, max: 400}, 'default');
                // setNeedsMoreData(false);
            });
        }
    } 

    const loadBenchmarkData = () => {
        // fetch('http://localhost:8080/performance-date/1/5000/c/' + props.date).then(response => {
          fetch('https://0w55vqldgh.execute-api.us-east-1.amazonaws.com/default/getPerformanceForDate?period=1&numPicks=5000&date=' + props.date).then(response => {  
            return response.json();
        }).then(responseData => {
            setBenchmarkData([...responseData]);
        });
    }

    const loadMoreData = (chart, min, max) => {
        if (!needsMoreData) {
            setNeedsMoreData(true);
        }
    };

    useEffect(() => {
        if (needsMoreData && !isWaiting.current) {
            isWaiting.current = true;
            // fetch('http://localhost:8080/prediction/' + props.stockName + '/' + props.period + '/' + page).then(response => {
              fetch(' https://6tzw64t9eb.execute-api.us-east-1.amazonaws.com/default/getStockHistory?stockName=' + props.stockName + 
              '&period=' + props.period + '&page=' + page).then(response => {
                return response.json();
            }).then(responseData => {
                setPage(page + 1);
                setData([...responseData.reverse(), ...data]);
                setNeedsMoreData(false);
                
                // chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current)+responseData.length, max: maxRef.current+responseData.length}, 'default');
                maxRef.current = maxRef.current + responseData.length;
                // maxRef.current = maxRef.current+400;
                isWaiting.current = false;
            }).catch(e => {
                isWaiting.current = false;
            });
        } 
        chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current), max: maxRef.current}, 'default');
        
        // if (data.length === 0) {
        if (needsData) {
            loadData();
        }

        if (props.date !== benchmarkDate.current || 
              props.stockName !== benchmarkStockName.current || 
              (benchmarkData.length == 0 && startIndex < labels.length-1)) {
            benchmarkStockName.current = props.stockName;
            benchmarkDate.current = props.date;
            loadBenchmarkData();
        }

        // chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current), max: maxRef.current}, 'default');
    });

    if (currentStock !== props.stockName || currentPeriod !== props.period) {
        setCurrentStock(props.stockName);
        setCurrentPeriod(props.period);
        // setData([]);
        setNeedsData(true);
        loadData();
        setPage(0);
        setIsLoading(true);
        props.onStartedLoadingHistory();
    }

    const zoomCompleteHandler = (chart) => {
        const {min, max} = chart.chart.scales.x;
        console.log('min: ' + min + ', max: ' + max);
        console.log("Setting max to " + max);
        console.log("Setting size to " + (max-min));
        maxRef.current=max;
        sizeRef.current=max-min;
      // if (min == 0 && !props.isLoading) {
        if (min < 200 && !isLoading) {
          loadMoreData();
        }
    };
    

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
        // backgroundColor: 'rgba(147, 64, 108, 0.2)',
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
  
        const chartData = {
        labels,
        datasets: [
          {
          type: 'line',
          label: 'Close Price',
          data: values,
          borderColor: 'rgba(64, 66, 147, 0.75)',
          backgroundColor: 'rgba(64, 66, 147, 0.75)',
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
            borderDash: [10,2],
            // borderColor: 'rgb(145, 138, 1)',
            // backgroundColor: 'rgba(145, 138, 1, 0.2)',135, 113, 80
            yAxisID: 'y',
          },
        ],
    };

    if (startIndex < labels.length-1) {
      chartData.datasets.push({
        type: 'line',
        label: 'All Stocks Price Movement',
        data: benchmarkValues,
        // borderColor: 'rgba(245, 190, 66, 0.85)',
        borderColor: 'rgba(131, 24, 80, 0.75)',
        backgroundColor: 'rgba(256,256,256, 0.75)',
        borderDash: [10,2],
        // borderColor: 'rgba(131, 24, 80, 0.75)',
        // backgroundColor: 'rgba(131, 24, 80, 0.75)',209, 151, 42
        yAxisID: 'y'
      });
    }


    return <Chart ref={chartRef} options={options} data={chartData} onDoubleClick={doubleClickHandler} />;
    

}

export default StockHistoryComponent;