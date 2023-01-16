import React from 'react'
import StockHistoryComponent from './History/StockHistoryComponent';
import StockDate from './StockDetails/StockDate';
import StockTable from './Picks/StockTable';
import { useState } from 'react';
import '../node_modules/react-datepicker/src/stylesheets/datepicker.scss'
import styles from './App.module.css';

const timeSwitch = (date) => {
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+1}`;
    // return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
}

const App = () => {
    const [selectedStock, setSelectedStock] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [period, setPeriod] = useState(1);

    const stockSelectedHandler = (stock) => {
        setSelectedStock(stock);
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

    return (
        <React.Fragment>
                <div className={`${styles.navbar} ${styles['details-parent']}`}>
                    <div className={`${styles['details-child']}`}>
                        <h3 className={`${styles.banner}`}><b>No Market for Old Men</b></h3>
                    </div>
                {/* <div className={`${styles['new-expense__control']}`}> */}
                        {/* <label>Date</label> */}
                    <div className={`${styles['details-child']}`}>
                        <input className={`${styles.select}`} type="date" value={selectedDate} onChange={dateChangeHandler} />
                    </div>
                    {/* </div> */}
                    <div className={`${styles['details-child']}`}>
                        <select className={`${styles.select}`} name="periods" id="periods" onChange={periodChangeHandler} value={period}>
                            <option value="1">1 Day Period</option>
                            <option value="2">2 Day Period</option>
                            <option value="3">3 Day Period</option>
                            <option value="4">4 Day Period</option>
                            <option value="5">5 Day Period</option>
                        </select>
                    </div>

                </div>
        
            {/* <ReactDatePicker selected={Date.parse(selectedDate)} onChange={dateChangeHandler} /> */}
            {!!selectedStock && <StockDate stockName={selectedStock} date={selectedDate} />}
            {/* {!!selectedStock && <StockDate stockName={selectedStock} date='2023-01-13' />} */}
            {!!selectedStock && <StockHistoryComponent stockName={selectedStock} period={period} />}
            {!selectedStock && <p>Select a stock for details.</p>}
            <StockTable date={selectedDate} period={period} stockSelectedHandler={stockSelectedHandler} datePopulatedHandler={datePopulatedHandler} />
            {/* <StockTable date='2023-01-13' period="5" stockSelectedHandler={stockSelectedHandler} /> */}
        </React.Fragment>
    );
};

export default App