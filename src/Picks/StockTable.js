import StockItem from "./StockItem";
import { useState, useEffect } from "react";
import './StockTable.scss';

const StockTable = (props) => {

    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(props.date);
    const [currentPeriod, setCurrentPeriod] = useState(props.period);

    const loadData = (usePage=page, useData=data) => {
        fetch('http://localhost:8080/prediction/all/' +  (!!props.date ? props.date : '0') + '/' + props.period + '/' + usePage).then(response => {
            return response.json();
        }).then(responseData => {
            if (responseData[0].date !== props.date) {
                props.datePopulatedHandler(responseData[0].date);
            }
            setPage(usePage + 1);
            setData([...useData, ...responseData]);
            setIsLoading(false);
        });
    }

    if (currentDate !== props.date || currentPeriod !== props.period) {
        setCurrentDate(props.date);
        setCurrentPeriod(props.period);
        setIsLoading(true);
        setData([]);
        setPage(0);
    }

    useEffect(() => {
        if (data.length === 0) {
            loadData();
        }
    });
    let dayClarifier = new Date();

    return (
        <table>
            <thead>
                <tr>
                    <th rowSpan="2">Rank</th>
                    <th rowSpan="2">Stock</th>
                    <th rowspan="2">Close Price</th>
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
                        score={item.score}
                        nextPeriodClosePrice={item.nextPeriodClosePrice}
                        nextPeriodSubsequentOpenPrice={item.nextPeriodSubsequentOpenPrice}
                        stockSelectedHandler={props.stockSelectedHandler}
                    />))}
            </tbody>
            {isLoading && <tfoot>
                            <span>Loading...</span>
                          </tfoot>
            }
        </table>
    );
};

export default StockTable;



