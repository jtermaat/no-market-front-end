import { useRef, React } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';

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
    const scaleMax = Math.max(25, ...scoreData);
    const scaleMin = Math.min(...scoreData) < 0 ? Math.min(-5, ...scoreData) : 0;

    const chartRef = useRef();
    const clickHandler = (event) => {
      const element = getElementAtEvent(chartRef.current, event)[0];
      if (!!element) {
        const period = 5*(element.index + 1);
        props.periodChangeHandler(period);
      }
    }


    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            display: false
          },
          title: {
            display: true,
            text: 'All Period Scores'
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
                // label: 'All Period Scores',
                data: scoreData,
                // backgroundColor: props.data.map(d => d.period == props.period ? 'rgba(179, 57, 59, 0.5)' : 'rgba(147, 145, 64, 0.5)'),
                // backgroundColor: props.data.map(d => d.period == props.period ? 'rgba(255, 252, 94, 0.5)' : 'rgba(147, 145, 64, 0.5)'),
                // backgroundColor: props.data.map(d => d.period == props.period ? 'rgba(179, 57, 59, 0.5)' : 'rgba(147, 145, 64, 0.5)'),
                // backgroundColor: props.data.map(d => d.period == props.period ? 'rgba(255, 220, 94, 0.5)' : 'rgba(147, 145, 64, 0.5)'),
                // backgroundColor: props.data.map(d => d.period == props.period ? 'rgba(55, 148, 204, 0.5)' : 'rgba(147, 145, 64, 0.5)'),
                // backgroundColor: props.data.map(d => d.period == props.period ? 'rgba(64, 147, 103, 0.5)' : 'rgba(147, 145, 64, 0.5)'),
                // backgroundColor: props.data.map(d => d.period == props.period ? 'rgba(64, 55, 24, 0.5)' : 'rgba(147, 145, 64, 0.5)'),
                // backgroundColor: props.data.map(d => d.period == props.period ? 'rgba(13, 11, 5, 0.5)' : 'rgba(77, 66, 28, 0.5)'),
                // backgroundColor: props.data.map(d => d.period == props.period ? 'rgba(105, 90, 39, 0.45' : 'rgba(13, 11, 5, 0.45)'),
                backgroundColor: props.data.map(d => d.period == props.period ? 'rgba(140, 62, 60, 0.45' : 'rgba(13, 11, 5, 0.45)'),
                
            },
        ],
    };
    return <Bar options={options} data={data} ref={chartRef} onClick={clickHandler} />;
}

export default PeriodScoresChart;