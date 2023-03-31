import React from "react";
import styles from './Explanation.module.css';

const Explanation = (props) => {

    return (
        <React.Fragment>
            <img src="../../../explainer.png" alt="explainer image" className={styles.image}></img>
        </React.Fragment>
    );
};

export default Explanation;