
const StockItem = (props) => {

    const toTwoDecimals = (number) => {
        return Math.round(number*100)/100;
    }

    let nextPeriodPercentChange = '-';
    if (!!props.nextPeriodClosePrice) {
        nextPeriodPercentChange = toTwoDecimals((((props.nextPeriodClosePrice - props.closePrice) / props.closePrice)*100.0)) + '%';
    }

    const clickHandler = (event) => {
        props.stockSelectedHandler(props.stockName);
    }
    
    return (
        <tr onClick={clickHandler}>
            <td>{props.rank}</td>
            <td>{props.stockName}</td>
            <td>{toTwoDecimals(props.closePrice)}</td>
            <td>{props.score}</td>
            <td>{nextPeriodPercentChange}</td>
        </tr>
    );
}

export default StockItem;