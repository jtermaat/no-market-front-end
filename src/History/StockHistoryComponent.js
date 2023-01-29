import React, { useState, useEffect } from 'react';
import StockHistoryChart from './StockHistoryChart';
import fontawesome from '@fortawesome/fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './StockHistoryComponent.module.css';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const StockHistoryComponent = (props) => {
    const [currentStock, setCurrentStock] = useState(props.stockName);
    const [currentPeriod, setCurrentPeriod] = useState(props.period);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [zoomMin, setZoomMin] = useState(0);
    const [zoomMax, setZoomMax] = useState(250);
    const [needsMoreData, setNeedsMoreData] = useState(false);

    fontawesome.library.add(faCircleNotch);


    const loadData = (usePage=page, useData=data) => {
        // setIsLoading(true);
        fetch('http://localhost:8080/prediction/' + props.stockName + '/' + props.period + '/' + usePage).then(response => {
            return response.json();
        }).then(responseData => {
            setPage(usePage + 1);
            setData([...responseData.reverse(), ...useData]);
            setIsLoading(false);
            // setNeedsMoreData(false);
        });
    } 

    const loadMoreDataHandler = (chart, min, max) => {
        if (!needsMoreData) {
            setNeedsMoreData(true);
        }
    };

    useEffect(() => {
        if (needsMoreData) {
            fetch('http://localhost:8080/prediction/' + props.stockName + '/' + props.period + '/' + page).then(response => {
                return response.json();
            }).then(responseData => {
                setPage(page + 1);
                setData([...responseData.reverse(), ...data]);
                setNeedsMoreData(false);
            });
        }
        if (data.length === 0) {
            loadData();
        }
    });

    if (currentStock !== props.stockName || currentPeriod !== props.period) {
        setCurrentStock(props.stockName);
        setCurrentPeriod(props.period);
        setData([]);
        setPage(0);
        setIsLoading(true);
    }


    return (
        <React.Fragment>
            {!isLoading && <StockHistoryChart stockName={props.stockName} 
                                    data={data} 
                                    isLoading={needsMoreData}
                                    period={props.period}
                                    loadMoreDataHandler={loadMoreDataHandler}
                                    zoomMin={zoomMin}
                                    zoomMax={zoomMax}
                                    date={props.date}
                                    datePickHandler={props.datePickHandler} /> }
            {!!isLoading && <FontAwesomeIcon icon="fa-solid fa-circle-notch" /> }
            {/* <div className={`${styles['btn-group']}`}>
                <button onClick={loadMoreDataHandler}>Load More</button>
            </div> */}
        </React.Fragment>
    );
    

}

export default StockHistoryComponent;