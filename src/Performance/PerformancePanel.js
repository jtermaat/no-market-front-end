import { useState } from "react";
import styles from './PerformancePanel.module.css';
import PerformanceChart from "./PerformanceChart";

const PerformancePanel = (props) => {

    const [numPicks, setNumPicks] = useState(5);

    const numPicksChangeHandler = (event) => {
        setNumPicks(event.target.value);
    }

    return (
        <div className={`${styles.screentop} ${styles.panel}`}>
            <h2><b>Performance Simulation</b></h2>
            <p>The simulation works by buying the top <i>n</i> picks each day, and holding them for <i>p</i> days before selling (<i>p</i> = <i>period</i>).  This means the portfolio will be split into <i>p</i> parts in order to buy and sell each day.  The portfolio can contain up to <i>n</i> x <i>p</i> stocks at any one time.</p>
            <field className={`${styles.text}`}>
                <label for="numPicks" className={`${styles.label}`}>Number of picks (<i>n</i>): </label>
                <select className={`${styles.select}`} 
                        name="numPicks" 
                        id="numPicks" 
                        onChange={numPicksChangeHandler} 
                        value={numPicks}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>     
                </select>
            </field>
            <PerformanceChart period={props.period} 
                            numPicks={numPicks} 
                            datePickHandler={props.datePickHandler} 
                            type="c"
                            onStartedLoadingPerformance={props.onStartedLoadingPerformance}
                            onDoneLoadingPerformance={props.onDoneLoadingPerformance}/>
        </div>
    );
}

export default PerformancePanel;