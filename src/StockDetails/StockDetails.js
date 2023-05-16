
const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const StockDetails = (props) => {
    return (
        <div>
            <div className="info-group" >
                <div><b>Employees:</b> {!!props.data.totalEmployees ? formatNumber(props.data.totalEmployees) : ''}</div>
            </div>
            <p>{props.data.description}</p>
        </div>
    );

};

export default StockDetails;

