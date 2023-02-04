// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Chart, getElementAtEvent } from 'react-chartjs-2';
// import Zoom from 'chartjs-plugin-zoom';
// import annotationPlugin from 'chartjs-plugin-annotation';


// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   Zoom,
//   annotationPlugin,
// );

// // ChartJS.register(annotationPlugin);

// const StockHistoryChart = (props) => {


//     let lastPeriod = useRef('0');
//     let lastStock = useRef('');

//     let initialized = useRef(false);


//     // const chartRef = React.createRef();
//     const chartRef = useRef();
//     const doubleClickHandler = (event) => {
//       // console.log(getElementAtEvent(chartRef.current, event));
//       const date = labels[getElementAtEvent(chartRef.current, event)[0].index];
//       props.datePickHandler(date);
//     }

//     useEffect(() => {
//       // if (!initialized.current) {
//       //   maxRef.current = 400;
//       //   sizeRef.current = 250;
//       //   chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current), max: maxRef.current}, 'default');
//       //   initialized.current = true;
//       // }
//       // if (props.data.length < dataSizeRef.current) {
//       //   maxRef.current = 400;
//       //   sizeRef.current = 250;
//       //   chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current), max: maxRef.current}, 'default');
//       // } else {
//         // if (props.data.length >= dataSizeRef.current) {
//           if (lastPeriod.current != props.period || lastStock.current != props.stockName) {
//             console.log("Setting normal bounds.");
//             maxRef.current = 400;
//             sizeRef.current = 250;
//             // dataSizeRef.current = props.data.length;
//             // dataSizeRef.current = 10000;
//             chartRef.current.zoomScale('x', {min: 150, max: 400}, 'default');
//             // dataSizeRef.current = props.data.length;
//             lastPeriod.current = props.period;
//             lastStock.current = props.stockName;
//             dataSizeRef.current = props.data.length;
//           } else { //if (props.data.length >= dataSizeRef.current) {
//             const dataGrowthSize = props.data.length - dataSizeRef.current;
//             dataSizeRef.current = props.data.length;
//             console.log("data growth size: " + dataGrowthSize);
//             if (dataGrowthSize >= 0) {
//               console.log('maxRef.current: ' + maxRef.current);
//               console.log('sizeRef.current: ' + sizeRef.current);
//               chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current)+dataGrowthSize, max: maxRef.current+dataGrowthSize}, 'default');
//             }
//             // dataSizeRef.current = props.data.length;
//           }
//         //   const dataGrowthSize = props.data.length - dataSizeRef.current;
//         //   chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current)+dataGrowthSize, max: maxRef.current+dataGrowthSize}, 'default');
//         //   dataSizeRef.current = props.data.length;
//         // } else if (props.data.length < dataSizeRef.current) {
//         //   console.log("Hit case 2");
//         //   maxRef.current = 400;
//         //   sizeRef.current = 250;
//         //   chartRef.current.zoomScale('x', {min: 150, max: 400}, 'default');
//         //   dataSizeRef.current = props.data.length;
//         // }
//         // const dataGrowthSize = props.data.length - dataSizeRef.current;
//         //   chartRef.current.zoomScale('x', {min: (maxRef.current-sizeRef.current)+dataGrowthSize, max: maxRef.current+dataGrowthSize}, 'default');
//       // }
//       // dataSizeRef.current = props.data.length;
//       // if (props.data.length > 0) {
//       //   dataSizeRef.current = props.data.length;
//       // }
//     });

// }



// // export default StockHistoryChart;
