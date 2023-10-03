import React, { Fragment } from "react";
import styles from './MenuButton.module.css';
import MediaQuery from 'react-responsive';

const MenuButton = (props) => {

    return (
        <React.Fragment>
            <MediaQuery minWidth={600} >
                <div className={styles.dropdown}>
                    <button className={styles.dropbtn}>
                        <i className={`fa-solid fa-bars fa-2x ${styles.menuicon}`}></i>
                    </button>
                    <div className={`${styles["dropdown-content"]}`}>
                        <a style={{ textAlign: 'left', color: 'white' }} className={`${styles.menuitem} ${styles['menuitem-blue']}`} href="#"
                            onClick={props.dataClickHandler}><b>Data</b></a>
                        <a style={{ textAlign: 'left', color: 'white' }} className={`${styles.menuitem} ${styles['menuitem-green']}`} href="#"
                            onClick={props.performanceClickHandler}><b>Performance</b></a>
                        <a style={{ textAlign: 'left', color: 'white' }} className={`${styles.menuitem} ${styles['menuitem-yellow']}`} href="#"
                            onClick={props.aboutClickHandler}><b>Explanation</b></a>
                    </div>
                </div>
            </MediaQuery>
            <MediaQuery minWidth={400} maxWidth={599} >
                <div className={styles.dropdownmedium}>
                    <button className={styles.dropbtnmedium}>
                        <i className={`fa-solid fa-bars ${styles.menuicon}`}></i>
                    </button>
                    <div className={`${styles["dropdown-content"]}`}>
                        <a style={{ textAlign: 'left', color: 'white' }} className={`${styles.menuitem} ${styles['menuitem-blue']}`} href="#"
                            onClick={props.dataClickHandler}><b>Data</b></a>
                        <a style={{ textAlign: 'left', color: 'white' }} className={`${styles.menuitem} ${styles['menuitem-green']}`} href="#"
                            onClick={props.performanceClickHandler}><b>Performance</b></a>
                        <a style={{ textAlign: 'left', color: 'white' }} className={`${styles.menuitem} ${styles['menuitem-yellow']}`} href="#"
                            onClick={props.aboutClickHandler}><b>Explanation</b></a>
                    </div>
                </div>
            </MediaQuery>
            <MediaQuery maxWidth={399} >
                <div className={styles.dropdownmedium}>
                    <button className={styles.dropbtnmedium}>
                        <i className={`fa-solid fa-bars ${styles.menuicon}`}></i>
                    </button>
                    <div className={`${styles["dropdown-content"]}`}>
                        <a style={{ textAlign: 'left', color: 'white' }} className={`${styles.menuitem} ${styles['menuitem-blue']}`} href="#"
                            onClick={props.dataClickHandler}><b>Data</b></a>
                        <a style={{ textAlign: 'left', color: 'white' }} className={`${styles.menuitem} ${styles['menuitem-green']}`} href="#"
                            onClick={props.performanceClickHandler}><b>Performance</b></a>
                        <a style={{ textAlign: 'left', color: 'white' }} className={`${styles.menuitem} ${styles['menuitem-yellow']}`} href="#"
                            onClick={props.aboutClickHandler}><b>Explanation</b></a>
                    </div>
                </div>
            </MediaQuery>
        </React.Fragment>
    );
};

export default MenuButton