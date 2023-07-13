import React from "react";
import styles from './Explanation.module.css';

const Explanation = (props) => {

    return (
        <React.Fragment>
            <iframe className={styles.video} width="920" height="600" src="https://www.youtube.com/embed/wPc586Rxu10" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            {/* <img src="../../../explainer.png" alt="explainer image" className={styles.image}></img> */}
        </React.Fragment>
    );
};

export default Explanation;