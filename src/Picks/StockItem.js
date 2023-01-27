
const StockItem = (props) => {

    const toTwoDecimals = (number) => {
        return Math.round(number*100)/100;
    }

    let nextPeriodPercentChangeClose = '-';
    if (!!props.nextPeriodClosePrice) {
        nextPeriodPercentChangeClose = toTwoDecimals((((props.nextPeriodClosePrice - props.closePrice) / props.closePrice)*100.0)) + '%';
    }
    let nextPeriodPercentChangeOpen = '-';
    if (!!props.nextPeriodSubsequentOpenPrice) {
        nextPeriodPercentChangeOpen = toTwoDecimals((((props.nextPeriodSubsequentOpenPrice - props.nextDayOpenPrice) / props.nextDayOpenPrice) * 100.0)) + '%';
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
            <td>{nextPeriodPercentChangeClose}</td>
            <td>{nextPeriodPercentChangeOpen}</td>
        </tr>
    );
}

export default StockItem;