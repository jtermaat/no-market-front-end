import { useState } from "react";
import styles from './PerformanceMetrics.module.css';

const format = (number) => {
    return Math.round((number + Number.EPSILON) * 1000) / 1000
};

const PerformanceMetrics = (props) => {

    return (
        <table className={styles.table}>
            <thead>
            <tr >
                <th className={styles.ignore}></th>
                <th className={styles.th}>Gain</th>
                <th className={styles.th}>Standard Deviation</th>
                <th className={styles.th}>Gain / Standard Deviation</th>
            </tr>
            </thead>
            <tr className={styles.bodytr}>
                <td className={`${styles.td} ${styles.omarket} ${styles.alignright}`}><b>Top {props.numPicks} stocks</b></td>
                <td className={`${styles.td} ${styles.omarket}`}>{format(props.modelMetrics.gain)}</td>
                <td className={`${styles.td} ${styles.omarket}`}>{format(props.modelMetrics.deviation)}</td>
                <td className={`${styles.td} ${styles.omarket}`}><b>{format(props.modelMetrics.gain / props.modelMetrics.deviation)}</b></td>
            </tr>
            <tr className={styles.bodytr}>
                <td className={`${styles.td} ${styles.all} ${styles.alignright}`}><b>All Stocks</b></td>
                <td className={`${styles.td} ${styles.all}`}>{format(props.baselineMetrics.gain)}</td>
                <td className={`${styles.td} ${styles.all}`}>{format(props.baselineMetrics.deviation)}</td>
                <td className={`${styles.td} ${styles.all}`}><b>{format(props.baselineMetrics.gain / props.baselineMetrics.deviation)}</b></td>
            </tr>
        </table>
    );
};

export default PerformanceMetrics;