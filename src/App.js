import React from 'react'
import StockHistoryComponent from './History/StockHistoryComponent';
import StockDate from './StockDetails/StockDate';
import StockTable from './Stocks/StockTable';
import PerformancePanel from './Performance/PerformancePanel';
import NavBar from './NavBar/NavBar';
import Spinner from './Common/Spinner';
import { useState, useRef } from 'react';
import styles from './App.module.css';
import Explanation from './Explanation/Explanation';

const SCREEN_DATA = 'data';
const SCREEN_PERFORMANCE = 'performance';
const SCREEN_ABOUT = 'about'; 

const App = () => {
    const [selectedStock, setSelectedStock] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [period, setPeriod] = useState(35);
    const [screen, setScreen] = useState(SCREEN_DATA);
    const [isLoading, setIsLoading] = useState(false);

    let loadingPeriodsRef = useRef(false);
    let loadingDetailsRef = useRef(false);
    let loadingHistoryRef = useRef(false);
    let loadingPerformanceRef = useRef(false);

    const stockSelectedHandler = (stock) => {
        setSelectedStock(stock);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        setScreen(SCREEN_DATA);
    };

    const dateChangeHandler = (event) => {
        setSelectedDate(event.target.value);
    }
    const datePopulatedHandler = (date) => {
        setSelectedDate(date);
    }

    const periodChangeHandler = (event) => {
        setPeriod(event.target.value);
    }

    const graphPeriodChangeHandler = (value) => {
        setPeriod(value);
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
    
    const onStartedLoadingPeriods = () => {
        loadingPeriodsRef.current = true;
        setIsLoading(true);
    }

    const onDoneLoadingPeriods = () => {
        loadingPeriodsRef.current = false;
        if (!(loadingDetailsRef.current || loadingHistoryRef.current)) {
            setIsLoading(false);
        }
    }

    const onStartedLoadingDetails = () => {
        loadingDetailsRef.current = true;
        setIsLoading(true);
    }

    const onDoneLoadingDetails = () => {
        loadingDetailsRef.current = false;
        if (!(loadingPeriodsRef.current || loadingHistoryRef.current)) {
            setIsLoading(false);
        }
    }

    const onStartedLoadingHistory = () => {
        loadingHistoryRef.current = true;
        setIsLoading(true);
    }

    const onDoneLoadingHistory = () => {
        loadingHistoryRef.current = false;
        if (!(loadingPeriodsRef.current || loadingDetailsRef.current)) {
            setIsLoading(false);
        }
    }

    const onStartedLoadingPerformance = () => {
        loadingPerformanceRef.current = true;
        setIsLoading(true);
    }

    const onDoneLoadingPerformance = () => {
        loadingPerformanceRef.current = false;
        setIsLoading(false);
    }

    const isDoneLoadingDataScreen = () => {
        return !(loadingPeriodsRef.current || loadingDetailsRef.current || loadingHistoryRef.current);
    }


    if (isLoading && (
        (screen == SCREEN_DATA && isDoneLoadingDataScreen()) ||
        (screen === SCREEN_PERFORMANCE && !loadingPerformanceRef.current))) {
        setIsLoading(false);
    }

    return (
        <React.Fragment>
            {!!isLoading && <Spinner /> }
            <NavBar selectedDate={selectedDate} 
                    periodChangeHandler={periodChangeHandler}
                    dateChangeHandler={dateChangeHandler}
                    period={period} 
                    dataClickHandler={dataClickHandler}
                    performanceClickHandler={performanceClickHandler}
                    aboutClickHandler={aboutClickHandler}/>
            {!!selectedStock && screen == SCREEN_DATA && <StockDate stockName={selectedStock} 
                                                                    date={selectedDate}
                                                                    onStartedLoadingPeriods={onStartedLoadingPeriods}
                                                                    onDoneLoadingPeriods={onDoneLoadingPeriods}
                                                                    onStartedLoadingDetails={onStartedLoadingDetails}
                                                                    onDoneLoadingDetails={onDoneLoadingDetails}
                                                                    period={period} 
                                                                    periodChangeHandler={graphPeriodChangeHandler}/>}
            {!!selectedStock && screen == SCREEN_DATA && <StockHistoryComponent stockName={selectedStock} 
                                                                                period={period} 
                                                                                date={selectedDate}
                                                                                datePickHandler={datePickHandler}
                                                                                onDoneLoadingHistory={onDoneLoadingHistory}
                                                                                onStartedLoadingHistory={onStartedLoadingHistory} />}
            {!selectedStock && screen == SCREEN_DATA && <div className={styles.screentop} >
            <p>
                                                            <h4 className={styles.centertext}>Welcome to <i>O Market, Where Art Thou</i> </h4>

<i>O Market</i> is a web platform created by <a href="https://www.instagram.com/raceyouanytime">John TerMaat</a> that uses machine learning to provide educational and academic insights about individual stocks in the S&P 500. Please note that <i>O Market</i> does not offer financial advice. The information and predictions provided are for educational purposes only. They should not be considered as a substitute for professional financial advice or used as the sole basis for investment decisions.<br/><br/>

Investing in stocks carries risks, and past performance is not indicative of future results. You are responsible for your own investment decisions, and <i>O Market</i> recommends consulting a qualified financial advisor. <i>O Market</i> does not guarantee the accuracy of predictions or assume liability for any financial losses incurred from using our platform.<br/><br/>

Enjoy exploring <i>O Market</i> responsibly as a resource to enhance your understanding of the stock market.  For more information, use the menu on the top-right to navigate to the "Explanation" page.

<br/>
<h4>About Me</h4>
My name is John TerMaat.  I'm a software engineer with a curious mind and a lot of interests.  Follow me on <a href="https://www.instagram.com/raceyouanytime">Instagram</a> and <a href="https://www.threads.net/@raceyouanytime">Threads.</a> 


                                                            </p>
                                                            <h3 className={styles.centertext}>Select a stock</h3>
                                                            
                                                        </div>}

            {screen == SCREEN_PERFORMANCE && <PerformancePanel datePickHandler={datePickHandler} 
                                                period={period} 
                                                date={selectedDate}
                                                onStartedLoadingPerformance={onStartedLoadingPerformance}
                                                onDoneLoadingPerformance={onDoneLoadingPerformance}/>}

            {screen == SCREEN_ABOUT && <Explanation/>}

            {(screen == SCREEN_PERFORMANCE || screen == SCREEN_DATA) && <StockTable className={screen === SCREEN_DATA ? styles.screentop : ''}
                        date={selectedDate} 
                        period={period} 
                        selectedStock={selectedStock} 
                        stockSelectedHandler={stockSelectedHandler} 
                        datePopulatedHandler={datePopulatedHandler} />}

        </React.Fragment>
    );
};

export default App