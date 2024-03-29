import styles from './StockItem.module.css';

const StockItem = (props) => {

    const toTwoDecimals = (number) => {
        return Math.round(number*100)/100;
    }

    let nextPeriodPercentChangeClose = '-';
    if (!!props.nextPeriodClosePrice) {
        nextPeriodPercentChangeClose = toTwoDecimals((((props.nextPeriodClosePrice - props.closePrice) / props.closePrice)*100.0)) + '%';
    }

    const clickHandler = (event) => {
        props.stockSelectedHandler(props.stockName);
    }
    
    return (
        <tr className={props.selectedStock==props.stockName ? styles.selected : ''} onClick={clickHandler}>
            <td>{props.rank}</td>
            <td>{props.stockName}</td>
            <td>{toTwoDecimals(props.openPrice)}</td>
            <td>{toTwoDecimals(props.closePrice)}</td>
            <td>{props.score}</td>
            <td>{nextPeriodPercentChangeClose}</td>
        </tr>
    );
}

export default StockItem;