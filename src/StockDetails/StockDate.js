import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import PeriodScoresChart from './PeriodScoresChart';
import StockDetails from './StockDetails';
import Spinner from '../Common/Spinner';
import styles from './StockDate.module.css';
import MediaQuery from 'react-responsive';

const StockDate = (props) => {
    // const [stockName, setStockName] = useState('');
    // const [date, setDate] = useState(null);
    const [periodData, setPeriodData] = useState([]);
    const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);
    const [detailData, setDetailData] = useState({});
    const [isLoadingDetails, setIsLoadingDetails] = useState(true);

    let stockName = useRef('');
    let date = useRef('');
    let needPeriodData = useRef(false);
    let needDetailData = useRef(false);

    let periodError = useRef(false);
    let detailError = useRef(false);
    // let periodData = useRef(0);

    const loadPeriodData = () => {
        // const realDate = !props.date ? null : props.date.getFullYear() + "-" + props.date.getMonth() + "-" + props.date.getDate();
        // setIsLoadingPeriods(true);
        props.onStartedLoadingPeriods();
        periodError.current = false;
        // fetch('http://localhost:8080/prediction/stock/' + props.stockName + '/' + props.date).then(response => {
        fetch('https://wn5oloaa27.execute-api.us-east-1.amazonaws.com/default/getStockDate?stockName=' + props.stockName + 
                '&date=' + props.date).then(response => {
            return response.json();
        }).then(responseData => {
            setPeriodData(responseData.sort((a,b) => a.period < b.period ? -1 : a.period > b.period ? 1 : 0));
            setIsLoadingPeriods(false);
            props.onDoneLoadingPeriods();
        }).catch(error => {
            periodError.current = true;
        });
    }

    const loadDetailData = () => {
        setIsLoadingDetails(true);
        props.onStartedLoadingDetails();
        detailError.current = false;
        // fetch('http://localhost:8080/stock-details/' + props.stockName).then(response => {
        fetch(' https://mcgnbffws5.execute-api.us-east-1.amazonaws.com/default/getStockDetails?stockName=' + props.stockName).then(response => {
            if (response.status == 200) {
                return response.json();
            } else {
                return response;
            }
        }).then(responseData => {
            console.log(responseData);
            setDetailData(responseData);
            // setIsLoadingDetails(false);
            props.onDoneLoadingDetails();
        }).catch(e => {
            console.log("ERROR!! " + e);
            setDetailData({
                stockName: props.stockName,
                stockFullName: props.stockName,
                marketCap: 0,
                totalEmployees: 0,
                description: `Data missing for ${props.stockName}`
            });
            detailError.current = true;
            props.onDoneLoadingDetails();
        });
    }

    // useEffect(() => {
        // let needPeriodData = false;
        // let needDetailData = false;
        if (date.current !== props.date && props.date !== null) {
            date.current = props.date;
            needPeriodData.current = true;
        }
        if (stockName.current !== props.stockName) {
            // setStockName(props.stockName);
            stockName.current = props.stockName;
            needPeriodData.current = true;
            needDetailData.current = true;
        }

    // });

    useEffect(() => {
        if (needPeriodData.current) {
            needPeriodData.current = false;
            loadPeriodData();
        }
        if (needDetailData.current) {
            needDetailData.current = false;
            loadDetailData();
        }
    });

    return (
        <React.Fragment>
            <div>
                <MediaQuery minWidth={850} >
                <div className={`${styles.screentop} ${styles['stock-title']}`}> 
                    <h1 ><b>{detailData.stockFullName}</b> ({detailData.stockName})</h1>
                </div> 
                <div className={`${styles['details-parent']}`}>
                    <MediaQuery minWidth={1080}>
                        <div className={`${styles['details-child-left']}`}>
                            <StockDetails data={detailData} />
                        </div>
                        <div className={`${styles['details-child-right']}`}>
                            <PeriodScoresChart data={periodData}
                                                period={props.period}
                                                periodChangeHandler={props.periodChangeHandler} />
                        </div>  
                    </MediaQuery>
                    <MediaQuery maxWidth={1079}>
                        <div className={`${styles['details-child']}`}>
                            <PeriodScoresChart data={periodData}
                                                period={props.period}
                                                periodChangeHandler={props.periodChangeHandler} />
                        </div>
                    </MediaQuery>
                </div>
                </MediaQuery>
                <MediaQuery maxWidth={849} >
                    <MediaQuery minWidth={500}>
                        <div className={`${styles.screentop} ${styles['stock-title-mobile']}`}> 
                            <h3 ><b>{detailData.stockFullName}</b> ({detailData.stockName})</h3>
                        </div> 
                    </MediaQuery>
                    <MediaQuery minWidth={400} maxWidth={499}>
                        <div className={`${styles.screentopmedium} ${styles['stock-title-mobile']}`}> 
                            <h3 ><b>{detailData.stockFullName}</b> ({detailData.stockName})</h3>
                        </div> 
                    </MediaQuery>
                    <MediaQuery maxWidth={399}>
                        <div className={`${styles.screentopsmall} ${styles['stock-title-mobile']}`}> 
                            <h3 ><b>{detailData.stockFullName}</b> ({detailData.stockName})</h3>
                        </div> 
                    </MediaQuery>
                
                <div className={`${styles['details-parent-mobile']}`}>
                    <MediaQuery minWidth={1080}>
                        <div className={`${styles['details-child-left']}`}>
                            <StockDetails data={detailData} />
                        </div>
                        <div className={`${styles['details-child-right']}`}>
                            <PeriodScoresChart data={periodData}
                                                period={props.period}
                                                periodChangeHandler={props.periodChangeHandler} />
                        </div>  
                    </MediaQuery>
                    <MediaQuery maxWidth={1079}>
                        <div className={`${styles['details-child']}`}>
                            <PeriodScoresChart data={periodData}
                                                period={props.period}
                                                periodChangeHandler={props.periodChangeHandler} />
                        </div>
                    </MediaQuery>
                </div>
                </MediaQuery>
                
            </div>
        </React.Fragment>
    );
};

export default StockDate;