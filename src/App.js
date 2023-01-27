import React from 'react'
import StockHistoryComponent from './History/StockHistoryComponent';
import StockDate from './StockDetails/StockDate';
import StockTable from './Picks/StockTable';
import PerformanceChart from './Performance/PerformanceChart';
import PerformancePanel from './Performance/PerformancePanel';
import TweetWrapper from './Publication/TweetWrapper';
import NavBar from './NavBar/NavBar';
import { useState, useRef } from 'react';
import '../node_modules/react-datepicker/src/stylesheets/datepicker.scss'
import styles from './App.module.css';
import { propTypes } from 'react-bootstrap/esm/Image';

// import { Tweet } from 'react-twitter-widgets'

// const timeSwitch = (date) => {
//     return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+1}`;
//     // return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
// }

const SCREEN_DATA = 'data';
const SCREEN_PERFORMANCE = 'performance';
const SCREEN_ABOUT = 'about'; 


const App = () => {
    const [selectedStock, setSelectedStock] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [period, setPeriod] = useState(10);
    const [screen, setScreen] = useState(SCREEN_DATA);

    const stockSelectedHandler = (stock) => {
        setSelectedStock(stock);
        setScreen(SCREEN_DATA);
    };

    const dateChangeHandler = (event) => {
        // setSelectedDate(date.toISOString().split('T')[0])
        // setSelectedDate(timeSwitch(date));
        setSelectedDate(event.target.value);
    }
    const datePopulatedHandler = (date) => {
        setSelectedDate(date);
    }

    const periodChangeHandler = (event) => {
        setPeriod(event.target.value);
    }

    const datePickHandler = (date) => {
        setSelectedDate(date);
    }

    const dataClickHandler = () => {
        setScreen(SCREEN_DATA);
    }

    const performanceClickHandler = () => {
        setScreen(SCREEN_PERFORMANCE);
    }

    const aboutClickHandler = () => {
        setScreen(SCREEN_ABOUT);
    }
    

    // const performanceChartClickHandler =

    return (
        <React.Fragment>
            
            <NavBar selectedDate={selectedDate} 
                    periodChangeHandler={periodChangeHandler}
                    dateChangeHandler={dateChangeHandler}
                    period={period} 
                    dataClickHandler={dataClickHandler}
                    performanceClickHandler={performanceClickHandler}
                    aboutClickHandler={aboutClickHandler}/>
            {!!selectedStock && screen == SCREEN_DATA && <StockDate stockName={selectedStock} date={selectedDate} />}
            {!!selectedStock && screen == SCREEN_DATA && <StockHistoryComponent stockName={selectedStock} 
                                                                                period={period} 
                                                                                date={selectedDate}
                                                                                datePickHandler={datePickHandler} />}
            
            {/* {!selectedStock && <PerformancePanel datePickHandler={datePickHandler} 
                                                period={period} />} */}
            {screen == SCREEN_PERFORMANCE && <PerformancePanel datePickHandler={datePickHandler} 
                                                period={period} />}
            {!selectedStock && !!selectedDate && <div className={`${styles.screentop}`}>
                <TweetWrapper  date={selectedDate} />
            </div>}
            <div className={styles.panel} >
            {!selectedStock && <h2 className={`${styles.centertext}`}>Select a stock for details</h2>}
            </div>

            <StockTable date={selectedDate} period={period} stockSelectedHandler={stockSelectedHandler} datePopulatedHandler={datePopulatedHandler} />

        </React.Fragment>
    );
};

export default App