
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

const StockDetails = (props) => {
    return (
        <div>
            <h1><b>{props.data.stockFullName}</b> ({props.data.stockName})</h1>
            <div className="info-group" >
                <div><b>Employees:</b> {props.data.totalEmployees}</div>
                <div><b>Market Cap:</b> {formatter.format(props.data.marketCap)}</div>
            </div>
            <p>{props.data.description}</p>
        </div>
    );

};

export default StockDetails;

