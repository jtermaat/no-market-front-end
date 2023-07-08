import React, { useState } from "react";
import styles from './PerformancePanel.module.css';
import PerformanceChart from "./PerformanceChart";
import PerformanceMetrics from "./PerformanceMetrics";
import MediaQuery from "react-responsive";

const PerformancePanel = (props) => {

    const [numPicks, setNumPicks] = useState(5);
    const [modelMetrics, setModelMetrics] = useState({gain: 0, deviation:1});
    const [baselineMetrics, setBaselineMetrics] = useState({gain: 0, deviation:1});
    

    const numPicksChangeHandler = (event) => {
        setNumPicks(event.target.value);
    }

    const updateDeviationData = (data) => {
        if (data.name == 'model') {
            setModelMetrics(data);
        } else if (data.name == 'baseline') {
            setBaselineMetrics(data);
        }
    };


    return (
        <React.Fragment>
        <div className={`${styles.panel}`}>
        <MediaQuery minWidth={780}>
            <div className={styles.screentop} /> 
            <h2><b>Performance Simulation</b></h2>
            <p>The simulation works by buying the top <i>n</i> picks each day, and holding them for <i>p</i> days before selling (<i>p</i> = <i>period</i>).  This means the portfolio will be split into <i>p</i> parts in order to buy and sell each day.  The portfolio can contain up to <i>n</i> x <i>p</i> stocks at any one time.</p>
            <div className={`${styles.text}`}>
                <label for="numPicks" className={`${styles.label} ${styles.largetext}`}>Number of picks (<i>n</i>): </label>
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
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>     
                </select>
                <label for="period" className={`${styles.label} ${styles.largetext}`}>Period: </label>
                 <select className={`${styles.select} ${styles.largetext}`} name="periods" id="periods" onChange={props.periodChangeHandler} value={props.period}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="35">35</option>
                            <option value="40">40</option>
                            <option value="45">45</option>
                            <option value="50">50</option>
                        </select>
            </div>
            </MediaQuery>
            <MediaQuery minWidth={600} maxWidth={779}>
            <div className={styles.screentop} /> 
        <h3><b>Performance Simulation</b></h3>
            <p className={styles.mediumtext}>The simulation works by buying the top <i>n</i> picks each day, and holding them for <i>p</i> days before selling (<i>p</i> = <i>period</i>).  This means the portfolio will be split into <i>p</i> parts in order to buy and sell each day.  The portfolio can contain up to <i>n</i> x <i>p</i> stocks at any one time.</p>
            <div className={`${styles.text}`}>
                <label for="numPicks" className={`${styles.label} ${styles.mediumtext}`}>Number of picks (<i>n</i>): </label>
                <select className={`${styles.select} ${styles.mediumtext}`} 
                        name="numPicks" 
                        id="numPicks" 
                        onChange={numPicksChangeHandler} 
                        value={numPicks}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>     
                </select>
                <label for="period" className={`${styles.label} ${styles.mediumtext}`}>Period: </label>
                 <select className={`${styles.select} ${styles.mediumtext}`} name="periods" id="periods" onChange={props.periodChangeHandler} value={props.period}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="35">35</option>
                            <option value="40">40</option>
                            <option value="45">45</option>
                            <option value="50">50</option>
                        </select>
            </div>

        </MediaQuery>
        <MediaQuery minWidth={500} maxWidth={599}>
        <div className={styles.screentopmedium} /> 
        <h4><b>Performance Simulation</b></h4>
            <p className={styles.smalltext}>The simulation works by buying the top <i>n</i> picks each day, and holding them for <i>p</i> days before selling (<i>p</i> = <i>period</i>).  This means the portfolio will be split into <i>p</i> parts in order to buy and sell each day.  The portfolio can contain up to <i>n</i> x <i>p</i> stocks at any one time.</p>
            <div className={`${styles.text}`}>
                <label for="numPicks" className={`${styles.label} ${styles.smalltext}`}>Number of picks (<i>n</i>): </label>
                <select className={`${styles.selectsmall} ${styles.smalltext}`} 
                        name="numPicks" 
                        id="numPicks" 
                        onChange={numPicksChangeHandler} 
                        value={numPicks}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>     
                </select>
                <label for="period" className={`${styles.label} ${styles.smalltext}`}>Period: </label>
                 <select className={`${styles.selectsmall} ${styles.smalltext}`} name="periods" id="periods" onChange={props.periodChangeHandler} value={props.period}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="35">35</option>
                            <option value="40">40</option>
                            <option value="45">45</option>
                            <option value="50">50</option>
                        </select>
            </div>

        </MediaQuery>
        <MediaQuery maxWidth={499}>
        <div className={styles.screentopsmall} /> 
        <h5><b>Performance Simulation</b></h5>
            <p className={styles.tinytext}>The simulation works by buying the top <i>n</i> picks each day, and holding them for <i>p</i> days before selling (<i>p</i> = <i>period</i>).  This means the portfolio will be split into <i>p</i> parts in order to buy and sell each day.  The portfolio can contain up to <i>n</i> x <i>p</i> stocks at any one time.</p>
            <div className={`${styles.text}`}>
                <label for="numPicks" className={`${styles.label} ${styles.tinytext}`}>Number of picks (<i>n</i>): </label>
                <select className={`${styles.selecttiny} ${styles.tinytext}`} 
                        name="numPicks" 
                        id="numPicks" 
                        onChange={numPicksChangeHandler} 
                        value={numPicks}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>     
                </select>
                <label for="period" className={`${styles.label} ${styles.tinytext}`}>Period: </label>
                 <select className={`${styles.selecttiny} ${styles.tinytext}`} name="periods" id="periods" onChange={props.periodChangeHandler} value={props.period}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="35">35</option>
                            <option value="40">40</option>
                            <option value="45">45</option>
                            <option value="50">50</option>
                        </select>
            </div>

        </MediaQuery>
            <PerformanceChart period={props.period} 
                            date={props.date}
                            numPicks={numPicks} 
                            datePickHandler={props.datePickHandler} 
                            type="c"
                            onStartedLoadingPerformance={props.onStartedLoadingPerformance}
                            onDoneLoadingPerformance={props.onDoneLoadingPerformance}
                            updateDeviationData={updateDeviationData}/>
            <PerformanceMetrics modelMetrics={modelMetrics} 
                                baselineMetrics={baselineMetrics}
                                date={props.date}
                                numPicks={numPicks} />
                                
        </div>
        
        
        </React.Fragment>
    );
}

export default PerformancePanel;