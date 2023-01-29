
const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const StockDetails = (props) => {
    return (
        <div>
            <div className="info-group" >
                <div><b>Employees:</b> {formatNumber(props.data.totalEmployees)}</div>
                <div><b>Market Cap:</b> {moneyFormatter.format(props.data.marketCap)}</div>
            </div>
            <p>{props.data.description}</p>
            <p><b>Zoom and pan. Double click a score bar to jump to a date.</b></p>
        </div>
    );

};

export default StockDetails;

