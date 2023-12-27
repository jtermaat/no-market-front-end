import React from "react";

import StockItem from "./StockItem";
import SearchBar from "./SearchBar";
import { useState, useEffect, useRef, memo } from "react";
import styles from './StockTable.module.scss';
import MediaQuery from "react-responsive";
import UrlFetcher from "../Common/UrlFetcher";

const EMPTY_SEARCH_STRING = '0';

const StockTable = (props) => {

    const [data, setData] = useState([]);

    let needsData = useRef(false);
    let page = useRef(0);
    let currentDate = useRef('');
    let currentPeriod = useRef(0);
    let searchString = useRef(EMPTY_SEARCH_STRING);

    let dataError = useRef(false);

    const loadData = () => {
        needsData.current = false;
        dataError.current = false;
        const url = UrlFetcher.getStockTableUrl(props.period, props.date, searchString.current, page.current);
        fetch(url).then(response => {
            return response.json();
        }).then(responseData => {
            const responseDataDate = responseData[0].date.split('T')[0]
            if (responseDataDate !== props.date) {
                props.datePopulatedHandler(responseDataDate);
            }
            page.current = page.current + 1;
            setData([...responseData]);
            needsData.current = false;
        }).catch(error => {
            dataError.current = true;
            needsData.current = false;
        });
    }

    const searchInputChangeHandler = (inputString) => {
        page.current = 0;
        if (!inputString || inputString == '') {
            searchString.current = EMPTY_SEARCH_STRING;
        } else {
            searchString.current = inputString;
        }
        loadData();
    }

    if (currentDate.current !== props.date || currentPeriod.current !== props.period) {
        currentDate.current = props.date;
        currentPeriod.current = props.period;
        needsData.current = true;
        page.current = 0;
        loadData();
    }

    if (needsData.current) {
        loadData();
    }

    return (
        <React.Fragment >
            <SearchBar onSearchInputChange={searchInputChangeHandler} />
            <MediaQuery minWidth={500} >
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th rowSpan="2">Rank</th>
                            <th rowSpan="2">Stock</th>
                            <th rowSpan="2">Open Price</th>
                            <th rowSpan="2">Close Price</th>
                            <th rowSpan="2">Score on {props.date}</th>
                            <th colSpan="2">Next {props.period}-Day % Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <StockItem
                                rank={index + 1}
                                key={item.id}
                                id={item.id}
                                stockName={item.stockName}
                                closePrice={item.closePrice}
                                openPrice={item.openPrice}
                                nextDayOpenPrice={item.nextDayOpenPrice}
                                score={Math.round(((item.score - 1.0) * 1000.0 + Number.EPSILON) * 100) / 100}
                                nextPeriodClosePrice={item.nextPeriodClosePrice}
                                nextPeriodSubsequentOpenPrice={item.nextPeriodSubsequentOpenPrice}
                                stockSelectedHandler={props.stockSelectedHandler}
                                selectedStock={props.selectedStock}
                            />))}
                    </tbody>
                </table>
            </MediaQuery>
            <MediaQuery maxWidth={499} >
                <table className={styles.tablemobile}>
                    <thead>
                        <tr>
                            <th rowSpan="2">Rank</th>
                            <th rowSpan="2">Stock</th>
                            <th rowSpan="2">Open Price</th>
                            <th rowSpan="2">Close Price</th>
                            <th rowSpan="2">Score on {props.date}</th>
                            <th colSpan="2">Next {props.period}-Day % Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <StockItem
                                rank={index + 1}
                                key={item.id}
                                id={item.id}
                                stockName={item.stockName}
                                closePrice={item.closePrice}
                                openPrice={item.openPrice}
                                nextDayOpenPrice={item.nextDayOpenPrice}
                                score={Math.round(((item.score - 1.0) * 1000.0 + Number.EPSILON) * 100) / 100}
                                nextPeriodClosePrice={item.nextPeriodClosePrice}
                                nextPeriodSubsequentOpenPrice={item.nextPeriodSubsequentOpenPrice}
                                stockSelectedHandler={props.stockSelectedHandler}
                                selectedStock={props.selectedStock}
                            />))}
                    </tbody>
                </table>
            </MediaQuery>
        </React.Fragment>
    );
};

export default memo(StockTable, (prevProps, nextProps) => prevProps.period === nextProps.period &&
    prevProps.date === nextProps.date &&
    prevProps.selectedStock === nextProps.selectedStock);



