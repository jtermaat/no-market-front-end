import React from "react";
import styles from './Explanation.module.css';
import MediaQuery from 'react-responsive';

const Explanation = (props) => {

    return (
        <React.Fragment>
            <MediaQuery minWidth={1000} >
            <iframe className={styles.video} width="920" height="600" src="https://www.youtube.com/embed/wPc586Rxu10" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </MediaQuery>
            <MediaQuery minWidth={500} maxWidth={999} >
            <iframe className={styles.videomedium} width="420" height="300" src="https://www.youtube.com/embed/wPc586Rxu10" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </MediaQuery>
            <MediaQuery maxWidth={499} >
            <iframe className={styles.videosmall} width="300" height="200" src="https://www.youtube.com/embed/wPc586Rxu10" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </MediaQuery>
        </React.Fragment>
    );
};

export default Explanation;