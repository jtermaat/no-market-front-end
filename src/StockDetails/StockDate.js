import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import PeriodScoresChart from './PeriodScoresChart';
import StockDetails from './StockDetails';
import Spinner from '../Common/Spinner';
import styles from './StockDate.module.css';

const StockDate = (props) => {
    const [stockName, setStockName] = useState('');
    const [date, setDate] = useState(null);
    const [periodData, setPeriodData] = useState([]);
    const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);
    const [detailData, setDetailData] = useState({});
    const [isLoadingDetails, setIsLoadingDetails] = useState(true);

    const loadPeriodData = () => {
        // const realDate = !props.date ? null : props.date.getFullYear() + "-" + props.date.getMonth() + "-" + props.date.getDate();
        // setIsLoadingPeriods(true);
        props.onStartedLoadingPeriods();
        fetch('http://localhost:8080/prediction/stock/' + props.stockName + '/' + props.date).then(response => {
            return response.json();
        }).then(responseData => {
            setPeriodData(responseData.sort((a,b) => a.period < b.period ? -1 : a.period > b.period ? 1 : 0));
            setIsLoadingPeriods(false);
            props.onDoneLoadingPeriods();
        });
    }

    const loadDetailData = () => {
        setIsLoadingDetails(true);
        props.onStartedLoadingDetails();
        fetch('http://localhost:8080/stock-details/' + props.stockName).then(response => {
            return response.json();
        }).then(responseData => {
            console.log(responseData);
            setDetailData(responseData);
            // setIsLoadingDetails(false);
            props.onDoneLoadingDetails();
        });
    }

    // useEffect(() => {
        let needPeriodData = false;
        let needDetailData = false;
        if (date !== props.date && props.date !== null) {
            setDate(props.date);
            needPeriodData = true;
        }
        if (stockName !== props.stockName) {
            setStockName(props.stockName);
            needPeriodData = true;
            needDetailData = true;
        }
        if (needPeriodData) {
            loadPeriodData();
        }
        if (needDetailData) {
            loadDetailData();
        }
    // });

    return (
        <React.Fragment>
            <div>
            <div className={`${styles.screentop} ${styles['stock-title']}`}> 
            {/* {!!isLoadingDetails && <Spinner />} */}
                <h1 ><b>{detailData.stockFullName}</b> ({detailData.stockName})</h1>
            </div> 
        
            <div className={`${styles['details-parent']}`}>
                <div className={`${styles['details-child-left']}`}>
                    {/* {!!isLoadingDetails && <Spinner />} */}
                    <StockDetails data={detailData} />
                </div>
                <div className={`${styles['details-child-right']}`}>
                    <PeriodScoresChart data={periodData}
                                       period={props.period}
                                       periodChangeHandler={props.periodChangeHandler} />
                    {/* {!!isLoadingPeriods && <Spinner /> } */}
                </div>  
            </div>
            </div>
        </React.Fragment>
    );
};

export default StockDate;