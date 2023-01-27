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

const PerformanceChart = (props) => {
    // const [processedData, setProcessedData] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [page, setPage] = useState(0);
    const [error, setError] = useState(false);

    const [baselineRawData, setBaselineRawData] = useState([]);
    // const [chartMin, setChartMin] = useState(0);
    // const [chartMax, setChartMax] = useState(250);
    // const bounds = useRef({min: 0, max:250});

    // console.log("HERE");

    const labels = rawData.map(item => item.date);
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

    const prepProcessedData = (min, pctChanges) => {
        let runningProduct = 1.0;
        return pctChanges.map((item, index) => {
            // console.log("runningProduct: " + runningProduct);
            // console.log("(runningProduct - 1.0) * 100: " + (runningProduct - 1.0) * 100.0);
            // console.log("rawData[index]: " + percentChanges[index]);
            if (index < min) {
                return 0.0;
            } else if (index == min) {
                runningProduct = 1.0;
            }
            const value = (runningProduct - 1.0) * 100.0;
            runningProduct = runningProduct * item;
            return value;
        });
    }

    const processedData = prepProcessedData(0, percentChanges);
    const processedBaselineData = prepProcessedData(0, baselinePercentChanges);


    const chartRef = useRef();
    const clickHandler = (event) => {
      console.log(getElementAtEvent(chartRef.current, event));
      const date = labels[getElementAtEvent(chartRef.current, event)[0].index];
      props.datePickHandler(date);
    }





    const loadData = () => {
        const promise1 = fetch('http://localhost:8080/performance/' + props.period + '/' + props.numPicks + '/' + props.type + '/' + 0).then(response => {
            return response.json();
        });
        const promise2 = fetch('http://localhost:8080/performance/' + props.period + '/' + 5000 + '/' + props.type + '/' + 0).then(response => {
          return response.json();
      });
      Promise.all([promise1, promise2]).then(([responseData1, responseData2]) => {
        setRawData(responseData1.slice(props.period).reverse());
        setBaselineRawData(responseData2.slice(props.period).reverse());
        setPage(1);
        setError(false);
      }).catch(error => {
        setError(true);
      });
        
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
    }

    const loadMoreData = (chart) => {
        const promise1 = fetch('http://localhost:8080/performance/' + props.period + '/' + props.numPicks + '/' + props.type + '/' + page).then(response => {
            return response.json();
        });
        const promise2 = fetch('http://localhost:8080/performance/' + props.period + '/' + 5000 + '/' + props.type + '/' + page).then(response => {
          return response.json();
      });
        Promise.all([promise1, promise2]).then(([responseData1, responseData2]) => {
            setRawData([...responseData1.reverse(), ...rawData]);
            setBaselineRawData([...responseData2.reverse(), ...baselineRawData]);
            // setProcessedData(processData([...responseData.reverse(), ...rawData]));
            setPage(page+1);
            // bounds.current = {min:0, max:250+250*page};
            // setChartMin(0);
            // setChartMax((1+page) * 250);
            // chart.chart.zoomScale('x', {min: bounds.current.min, max: bounds.current.max}, 'default');
            // chart.zoomScale('x', {min: -100, max: 0}, 'default');
        });
    }




        
    if ((rawData.length === 0 && !error) || rawData[0].numPicks != props.numPicks) {
        loadData();
    } 




    // const [processedData, setProcessedData] = useState(processData(percentChanges));

    // const values = props.data.map(item => item.closePrice);
    // const scores = props.data.map(item => item.score);
    // const maxScore = Math.max(...scores);
    // const minScore = Math.min(...scores);

    const zoomCompleteHandler = (chart) => {
      const {min, max} = chart.chart.scales.x;
    //   let bounds = useRef({min: 0, max:100});
    //   bounds.current = {min: min, max: max};
      if (min == 0) {
        // console.log('chartMin is 0, loading data');
       loadMoreData(chart) //, min, max);
    //   }
      } else {
        
        chart.chart.data.datasets[0].data = prepProcessedData(min, percentChanges);
        chart.chart.data.datasets[1].data = prepProcessedData(min, baselinePercentChanges);
        chart.chart.stop(); // make sure animations are not running
        chart.chart.update('none');
        // setChartMin(min);
        // setChartMax(max);
        // bounds.current = {min:min, max:max};
        // const ref = useRef(initialValue)
      }
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
            radius: 2.0,
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
              display: false,
              position: 'right',
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
        borderColor: 'rgb(24, 26, 131)',
        backgroundColor: 'rgb(24, 26, 131)',
        yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Cumulative % Change for all stocks',
          data: processedBaselineData,
          borderColor: 'rgb(131, 24, 80)',
          backgroundColor: 'rgb(131, 24, 80)',
          yAxisID: 'y',
          },
      ],
};

      return <Chart ref={chartRef} options={options} data={data} onClick={clickHandler} />;
}



export default PerformanceChart;
