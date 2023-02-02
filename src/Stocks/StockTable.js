import React from "react";

import StockItem from "./StockItem";
import SearchBar from "./SearchBar";
import { useState, useEffect, useRef } from "react";
import './StockTable.scss';

const EMPTY_SEARCH_STRING = '0';

const StockTable = (props) => {

    const [data, setData] = useState([]);

    let needsData = useRef(false);
    let page = useRef(0);
    let currentDate = useRef('');
    let currentPeriod = useRef(0);
    let searchString = useRef(EMPTY_SEARCH_STRING);

    const loadData = () => {
        needsData.current = false;
        fetch('http://localhost:8080/prediction/all/' +  (!!props.date ? props.date : '0') + '/' + 
                                                                        props.period + '/' + 
                                                                        searchString.current + '/' +
                                                                        page.current).then(response => {
            return response.json();
        }).then(responseData => {
            if (responseData[0].date !== props.date) {
                props.datePopulatedHandler(responseData[0].date);
            }
            // setPage(usePage + 1);
            page.current=page.current+1;
            setData([...responseData]);
            // setIsLoading(false);
            needsData.current = false;
        });
    }

    const searchInputChangeHandler = (inputString) => {
        page.current=0;
        if (!inputString || inputString == '') {
            searchString.current = EMPTY_SEARCH_STRING;
        } else {
            searchString.current=inputString;
        }
        loadData();
    }

    if (currentDate.current !== props.date || currentPeriod.current !== props.period) {
        // setCurrentDate(props.date);
        currentDate.current = props.date;
        // setCurrentPeriod(props.period);
        currentPeriod.current = props.period;
        // setIsLoading(true);
        // setData([]);
        needsData.current = true;
        // setPage(0);
        page.current = 0;
        loadData();
    }

    // useEffect(() => {
        // if (data.length === 0) {
        if (needsData.current) {
            loadData();
        }
    // });
    // let dayClarifier = new Date();

    return (
        <React.Fragment >
        <SearchBar onSearchInputChange={searchInputChangeHandler}/>
        <table>
            <thead>
                <tr>
                    <th rowSpan="2">Rank</th>
                    <th rowSpan="2">Stock</th>
                    <th rowSpan="2">Close Price</th>
                    <th rowSpan="2">Score on {props.date}</th>
                    <th colSpan="2">Next {props.period}-Day % Change</th>
                </tr>
                <tr>
                    <th>Close-to-Close</th>
                    <th>Open-to-Open</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <StockItem
                        rank={index+1}
                        key={item.id}
                        id={item.id}
                        stockName={item.stockName}
                        closePrice={item.closePrice}
                        nextDayOpenPrice={item.nextDayOpenPrice}
                        score={(item.score-1.0)*1000.0}
                        nextPeriodClosePrice={item.nextPeriodClosePrice}
                        nextPeriodSubsequentOpenPrice={item.nextPeriodSubsequentOpenPrice}
                        stockSelectedHandler={props.stockSelectedHandler}
                        selectedStock={props.selectedStock}
                    />))}
            </tbody>
        </table>
        </React.Fragment>
    );
};

export default StockTable;



