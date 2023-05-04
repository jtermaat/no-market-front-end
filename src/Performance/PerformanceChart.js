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

  const under700 = useMediaQuery ({ query: '(max-width: 700px)'});
  const under550 = useMediaQuery ({ query: '(max-width: 550px)'});
  const under450 = useMediaQuery ({ query: '(max-width: 450px)'});

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

    // const [processedData, setProcessedData] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [page, setPage] = useState(0);
    const [error, setError] = useState(false);
    const [needsMoreData, setNeedsMoreData] = useState(false);
    const [loadingMoreData, setLoadingMoreData] = useState(false);
    let loadingMoreRef = useRef(false);

    // let isWaiting = useRef(false);

    const DEFAULT_SIZE = 200;
    const DEFAULT_MAX = 400 //-props.period;
    const DEFAULT_LOAD_THRESH = 200;

    let needsData = useRef(true);
    let isWaiting = useRef(false);
    let maxRef = useRef(DEFAULT_MAX);
    let sizeRef = useRef(DEFAULT_SIZE);
    let dataSizeRef = useRef(10000);

    const [baselineRawData, setBaselineRawData] = useState([]);
    // const [chartMin, setChartMin] = useState(0);
    // const [chartMax, setChartMax] = useState(250);
    // const bounds = useRef({min: 0, max:250});

    // console.log("HERE");

    const labels = rawData.map(item => item.date.split("T")[0]);
    const percentChanges = rawData.map(item =>item.percentChange);
    const baselinePercentChanges = baselineRawData.map(item => item.percentChange);

    // let bounds = useRef({min: 0, max:100});

    // const processData = (rawData) => {
    //     // let bounds = useRef({min: 0, max:100});
    //     const dataList = [];
    //     let runningProduct = 1.0;
    //     for (let i = bounds.min;i<rawData.length;i++) {
    //         runningProduct = runningProduct * rawData[i];
    //         dataList.push((runningProduct-1) * 100.0);
    //     }
    //     return dataList;
    // }

    // let rawData = useRef([]);

    // const prepSemiProcessedData = (min, pctChanges) => {
    //     let runningProduct = 1.0;
    //     return pctChanges.map((item, index) => {
    //         // console.log("runningProduct: " + runningProduct);
    //         // console.log("(runningProduct - 1.0) * 100: " + (runningProduct - 1.0) * 100.0);
    //         // console.log("rawData[index]: " + percentChanges[index]);
    //         if (index < min) {
    //             return 0.0;
    //         } else if (index == min) {
    //             runningProduct = 1.0;
    //         }
    //         const returnVal = runningProduct;
    //         // const value = (runningProduct - 1.0) * 100.0;
    //         runningProduct = runningProduct * item;
    //         // return value;
    //         return returnVal;
    //     });
    // }

    // const prepProcessedData = (min, pctChanges) => {
    //     let runningProduct = 1.0;
    //     return pctChanges.map((item, index) => {
    //         // console.log("runningProduct: " + runningProduct);
    //         // console.log("(runningProduct - 1.0) * 100: " + (runningProduct - 1.0) * 100.0);
    //         // console.log("rawData[index]: " + percentChanges[index]);
    //         if (index < min) {
    //             return 0.0;
    //         } else if (index == min) {
    //             runningProduct = 1.0;
    //         }
    //         const value = (runningProduct - 1.0) * 100.0;
    //         runningProduct = runningProduct * item;
    //         return value;
    //     });
    // }

    const prepProcessedData = (min, max, pctChanges, name) => {
      let runningProduct = 1.0;
      const returnData = [];
      const deviationData = [];
      for (let i = 0;i<pctChanges.length;i++) {
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
      props.updateDeviationData({gain: deviationData[deviationData.length-1] - deviationData[0], deviation: standardDeviation(deviationData), name: name});
      // console.log(deviationData[(deviationData.length-1)] - deviationData[0])
      console.log('gain / deviation for ' + name + ': ' + (deviationData[(deviationData.length-1)] - deviationData[0]) / standardDeviation(deviationData));
      // console.log(standardDeviation(deviationData));
      // console.log(deviationData);
      return returnData;
    }

    const processedData = prepProcessedData(maxRef.current-sizeRef.current, maxRef.current, percentChanges, 'model');
    const processedBaselineData = prepProcessedData(maxRef.current-sizeRef.current, maxRef.current, baselinePercentChanges, 'baseline');


    const chartRef = useRef();
    const clickHandler = (event) => {
      console.log(getElementAtEvent(chartRef.current, event));
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
        // const promise1 = fetch('http://localhost:8080/performance/' + props.period + '/' + props.numPicks + '/' + props.type + '/' + 0).then(response => {
        const promise1 = fetch('https://o4f1k8x2fb.execute-api.us-east-1.amazonaws.com/default/getPerformance?period=' + props.period + 
                                '&numPicks=' + props.numPicks + '&page=' + 0).then(response => {
            return response.json();
        });
        // const promise2 = fetch('http://localhost:8080/performance/1/5000/c/0').then(response => {
          const promise2 = fetch('https://o4f1k8x2fb.execute-api.us-east-1.amazonaws.com/default/getPerformance?period=1&numPicks=5000&page=0').then(response => {
          return response.json();
        });
        Promise.all([promise1, promise2]).then(([responseData1, responseData2]) => {
          // setRawData(responseData1.slice(props.period).reverse());
          // setBaselineRawData(responseData2.slice(props.period).reverse());
          setRawData(responseData1.reverse());
          setBaselineRawData(responseData2.reverse());
          setPage(1);
          setError(false);
          // dataSizeRef.current = 10000;
          props.onDoneLoadingPerformance();
          needsData.current = false;
          isWaiting.current = false;
          maxRef.current = DEFAULT_MAX;
          sizeRef.current = DEFAULT_SIZE;
          dataSizeRef.current = responseData1.length; //responseData1.slice(props.period).length;
        }).catch(error => {
          setError(true);
          props.onDoneLoadingPerformance();
          needsData.current = false;
          isWaiting.current = false;
          // dataSizeRef.current = 10000;
        });
      }
    }
        
        // .then(responseData => {
        //     // let bounds = useRef({min: 0, max:100});
        //     // setRawData([...useData, ...responseData]);
        //     // let rawData = useRef([]);
        //     // rawData.current = [...responseData.reverse(), ...rawData];

        //     setRawData(responseData.reverse());
        //     setBaselineRawDataresponse
        //     // setProcessedData(processData([...responseData.reverse()]));
        //     setPage(1);
        //     // bounds.current = {min:0, max:250};
        //     // setChartMin(0);
        //     // setChartMax(250);
        //     setError(false);
        // }).catch(error => {
        //     setError(true);
        // });
    // }

    useEffect(() => {
      if (needsMoreData) {
        loadMoreData();
      }


      // console.log("Using effect.");

      if (rawData.length < dataSizeRef.current) {
        console.log("Resetting bounds.");
        maxRef.current = DEFAULT_MAX;
        sizeRef.current = DEFAULT_SIZE;
        // chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current), max: maxRef.current}, 'default');
      } else if (rawData.length > dataSizeRef.current) {
        console.log("Growing bounds.");
        const dataGrowthSize = rawData.length - dataSizeRef.current;
        console.log("Data growth size: " + dataGrowthSize);
        if (!!chartRef.current) {
          // maxRef.current = 
          const percentChanges = rawData.map(item =>item.percentChange);
          const baselinePercentChanges = baselineRawData.map(item => item.percentChange);
          const min = Number(maxRef.current-sizeRef.current)+Number(dataGrowthSize);
          const max = Number(maxRef.current)+Number(dataGrowthSize);
          // console.log("Updating processed data.");
          chartRef.current.data.datasets[0].data = prepProcessedData(min, max, percentChanges, 'model');
          chartRef.current.data.datasets[1].data = prepProcessedData(min, max, baselinePercentChanges, 'baseline');
          chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current)+dataGrowthSize, max: maxRef.current+dataGrowthSize}, 'default');
          // chartRef.current.stop(); // make sure animations are not running
          // chartRef.current.update('none');
          
          
          console.log("zoomed to " + min + ", " + max);
        }
      } else {
        const percentChanges = rawData.map(item =>item.percentChange);
        const baselinePercentChanges = baselineRawData.map(item => item.percentChange);
        chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current), max: maxRef.current}, 'default');
        console.log("No zoom.");
      }
      
      dataSizeRef.current = rawData.length;
      console.log("Setting data size to " + rawData.length);

    });

    const loadMoreData = (chart) => {
        if (!loadingMoreRef.current) {
          loadingMoreRef.current = true;
        // const promise1 = fetch('http://localhost:8080/performance/' + props.period + '/' + props.numPicks + '/' + props.type + '/' + page).then(response => {
        const promise1 = fetch('https://o4f1k8x2fb.execute-api.us-east-1.amazonaws.com/default/getPerformance?period=' + props.period + 
                                '&numPicks=' + props.numPicks + '&page=' + page).then(response => {
        
        return response.json();
        });
        // const promise2 = fetch('http://localhost:8080/performance/1/' + 5000 + '/' + props.type + '/' + page).then(response => {
          const promise2 = fetch('https://o4f1k8x2fb.execute-api.us-east-1.amazonaws.com/default/getPerformance?period=1&numPicks=5000&page=' 
                                  + page).then(response => {
          return response.json();
      });
        Promise.all([promise1, promise2]).then(([responseData1, responseData2]) => {
            // const {min, max} = chart.chart.scales.x;
            
            setRawData([...responseData1.reverse(), ...rawData]);
            setBaselineRawData([...responseData2.reverse(), ...baselineRawData]);
            // const percentChanges = rawData.map(item =>item.percentChange);
            // const baselinePercentChanges = baselineRawData.map(item => item.percentChange);
            // chartRef.current.data.datasets[0].data = prepProcessedData(maxRef.current-sizeRef.current+responseData1.length, percentChanges);
            // chartRef.current.data.datasets[1].data = prepProcessedData(maxRef.current-sizeRef.current+responseData2, baselinePercentChanges);
            // chartRef.current.stop(); // make sure animations are not running
            // chartRef.current.update('none');
            // const processedData = prepProcessedData(0, percentChanges);
            // const processedBaselineData = prepProcessedData(0, baselinePercentChanges);
            // setProcessedData(processData([...responseData.reverse(), ...rawData]));
            setPage(page+1);
            setNeedsMoreData(false);
            // bounds.current = {min:0, max:250+250*page};
            // setChartMin(0);
            // setChartMax((1+page) * 250);
            // chart.chart.zoomScale('x', {min: bounds.current.min, max: bounds.current.max}, 'default');
            // chart.zoomScale('x', {min: -100, max: 0}, 'default');
            loadingMoreRef.current = false;
        }).catch(error => {
            setNeedsMoreData(false);
            loadingMoreRef.current = false;
            setError(true);
        });
      }
    }




        
    if ((rawData.length === 0 && !error) || rawData[0].numPicks != props.numPicks || rawData[0].period != props.period) {
      // needsData.current=true;  
      loadData();
    } 




    // const [processedData, setProcessedData] = useState(processData(percentChanges));

    // const values = props.data.map(item => item.closePrice);
    // const scores = props.data.map(item => item.score);
    // const maxScore = Math.max(...scores);
    // const minScore = Math.min(...scores);

    const zoomCompleteHandler = (chart) => {
      const {min, max} = chart.chart.scales.x;

      maxRef.current=max;
      sizeRef.current=max-min;
      console.log("max: " + maxRef.current);
      console.log("size: " + sizeRef.current);
    // if (min == 0 && !props.isLoading) {
      if (min < DEFAULT_LOAD_THRESH && !needsMoreData) {
        // props.loadMoreDataHandler(chart, min, max);
        // loadMoreData(chart) 
        setNeedsMoreData(true);
      }
      // } else {
    //   let bounds = useRef({min: 0, max:100});
    //   bounds.current = {min: min, max: max};
    //   if (min == 0) {
    //     // console.log('chartMin is 0, loading data');
    //    loadMoreData(chart) //, min, max);
    // //   }
    //   } else {

        const percentChanges = rawData.map(item =>item.percentChange);
        const baselinePercentChanges = baselineRawData.map(item => item.percentChange);
        
        chart.chart.data.datasets[0].data = prepProcessedData(min, max, percentChanges, 'model');
        chart.chart.data.datasets[1].data = prepProcessedData(min, max, baselinePercentChanges, 'baseline');
        // chart.chart.plugins.annotation.annotations[0].value = labels.indexOf(props.date) - (maxRef.current - sizeRef.current);
        chart.chart.stop(); // make sure animations are not running
        chart.chart.update('none');
      // }
        // setChartMin(min);
        // setChartMax(max);
        // bounds.current = {min:min, max:max};
        // const ref = useRef(initialValue)
      // }

    //   maxRef.current=max;
    //   sizeRef.current=max-min;
    // // if (min == 0 && !props.isLoading) {
    //   if (min < 200) {
    //     props.loadMoreDataHandler(chart, min, max);
    //   }
    //   processData(percentChanges);
    };

    const zoomOptions = {
      limits: {
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

    console.log('annotationData: ' + labels.indexOf(props.date) + ', ' + (maxRef.current - sizeRef.current));
    console.log('labels: ' + labels);
    console.log('props.date: ' + props.date);

    const annotation = {
      type: "line",
      mode: "vertical",
      scaleID: "x",
      // value: labels.indexOf(props.date) - (maxRef.current - sizeRef.current),
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

    // const annotation2 = {
    //   type: 'box',
    //   backgroundColor: 'rgba(145, 138, 1, 0.2)',
    //   // backgroundColor: 'rgba(147, 64, 108, 0.2)',
    //   borderWidth: 0,
    //   xMax: Number(labels.indexOf(props.date)) + Number(props.period),
    //   xMin: labels.indexOf(props.date),
    //   label: {
    //     drawTime: 'afterDraw',
    //     display: false,
    //     content: `${props.period} Market Days`,
    //     position: {
    //       x: 'center',
    //       y: 'start'
    //     }
    //   }
    // };

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
            // y1: {
            //   type: 'linear',
            //   display: true,
            //   position: 'right',
            //   min: minScore,
            //   max: maxScore,
            //   grid: {
            //     drawOnChartArea: false,
            //   },
            // },
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
            borderDash: [10,2],
            // borderColor: 'rgb(145, 138, 1)',
            // backgroundColor: 'rgba(145, 138, 1, 0.2)',135, 113, 80
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
