import React, { useState, useEffect } from 'react';
import StockHistoryChart from './StockHistoryChart';
import styles from './StockHistoryComponent.module.css';

const StockHistoryComponent = (props) => {
    const [currentStock, setCurrentStock] = useState(props.stockName);
    const [currentPeriod, setCurrentPeriod] = useState(props.period);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


    const loadData = (usePage=page, useData=data) => {
        // setIsLoading(true);
        fetch('http://localhost:8080/prediction/' + props.stockName + '/' + props.period + '/' + usePage).then(response => {
            return response.json();
        }).then(responseData => {
            setPage(usePage + 1);
            setData([...responseData.reverse(), ...useData]);
            setIsLoading(false);
        });
    } 

    // useEffect(() => {
    // let reloadData = false;
    if (currentStock !== props.stockName || currentPeriod !== props.period) {
        setCurrentStock(props.stockName);
        setCurrentPeriod(props.period);
        setData([]);
        setPage(0);
        setIsLoading(true);
        // reloadData = true;
    }
    // if (currentPeriod !== props.period) {
    //     setCurrentPeriod(props.period);
    //     setData([]);
    //     setPage(0);
    //     // reloadData = true;
    // }

    // if (reloadData) {
    //     loadData(0, []);
    // }

    useEffect(() => {
        if (data.length === 0) {
            loadData();
        }
    });
    
    const loadMoreDataHandler = (event) => {
        loadData();
    }

    return (
        <React.Fragment>
            <StockHistoryChart stockName={props.stockName} 
                                    data={data} 
                                    isLoading={isLoading}
                                    period={props.period} />
            <div className={`${styles['btn-group']}`}>
                <button onClick={loadMoreDataHandler}>Load More</button>
            </div>
        </React.Fragment>
    );
    

}

export default StockHistoryComponent;