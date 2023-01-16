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
        fetch('http://localhost:8080/prediction/all/' +  props.date + '/' + props.period + '/' + usePage).then(response => {
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

    return (
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Stock</th>
                    <th>Close Price</th>
                    <th>Score</th>
                    <th>Next {props.period}-Day % Change</th>
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
                        score={item.score}
                        nextPeriodClosePrice={item.nextPeriodClosePrice}
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



