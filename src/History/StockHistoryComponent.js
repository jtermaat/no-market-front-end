import React, { useState, useEffect, useRef } from 'react';
import StockHistoryChart from './StockHistoryChart';
import Spinner from '../Common/Spinner';

const StockHistoryComponent = (props) => {
    const [currentStock, setCurrentStock] = useState(props.stockName);
    const [currentPeriod, setCurrentPeriod] = useState(props.period);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [zoomMin, setZoomMin] = useState(0);
    const [zoomMax, setZoomMax] = useState(250);
    const [needsMoreData, setNeedsMoreData] = useState(false);
    const [needsData, setNeedsData] = useState(true);

    let isWaiting = useRef(false);

    const loadData = () => {
        // setNeedsData(false);
        // setIsLoading(true);
        if (!isWaiting.current) {
            isWaiting.current = true;
            fetch('http://localhost:8080/prediction/' + props.stockName + '/' + props.period + '/' + 0).then(response => {
                return response.json();
            }).then(responseData => {
                setPage(1);
                setData([...responseData.reverse()]);
                setIsLoading(false);
                // setNeedsData(false);
                props.onDoneLoadingHistory();
                setNeedsData(false);
                isWaiting.current = false;
                
                // setNeedsMoreData(false);
            });
        }
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
        // if (data.length === 0) {
        // if (needsData) {
        //     loadData();
        // }
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


    return (
        <React.Fragment>
            <div>
            <StockHistoryChart stockName={props.stockName} 
                                    data={data} 
                                    isLoading={isLoading || needsMoreData}
                                    period={props.period}
                                    loadMoreDataHandler={loadMoreDataHandler}
                                    zoomMin={zoomMin}
                                    zoomMax={zoomMax}
                                    date={props.date}
                                    datePickHandler={props.datePickHandler} /> 
            {/* {!!isLoading && <Spinner /> } */}
            </div>
        </React.Fragment>
    );
    

}

export default StockHistoryComponent;