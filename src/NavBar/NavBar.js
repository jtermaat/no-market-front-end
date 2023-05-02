import MenuButton from './MenuButton';
import styles from './NavBar.module.css';
import MediaQuery from 'react-responsive';

const NavBar = (props) => {
    return (
        <div className={`${styles.navbar} ${styles['details-parent']}`}>
            <MediaQuery minWidth={1080}>
                
                <img src="./omarketicon.png" alt="icon" className={styles.image} />
                    <div className={`${styles['details-child-40']}`}>
                        
                        {/* <h3 className={`${styles.banner}`}><b>stocklist.ai</b></h3> */}
                        <h4 className={`${styles.banner}`}>O Market, Where Art Thou?</h4>
                    </div>
            </MediaQuery>
            <MediaQuery maxWidth={1079}>
            <MediaQuery minWidth={340}>
            <img src="./omarketicon.png" alt="icon" className={styles.imagemobile} />
            </MediaQuery>
                    <div className={`${styles['details-child-80']}`}>
                        
                        {/* <h3 className={`${styles.banner}`}><b>stocklist.ai</b></h3> */}
                        <h4 className={`${styles.banner}`}>O Market, Where Art Thou?</h4>
                    </div>
            </MediaQuery>
                <MediaQuery minWidth={1080}>
                    <div className={`${styles['details-child-30']}`}>
                        <input className={`${styles.select}`} type="date" value={props.selectedDate} onChange={props.dateChangeHandler} />
                    </div>
                    {/* </div> */}
                    <div className={`${styles['details-child-30']}`}>
                        <select className={`${styles.select}`} name="periods" id="periods" onChange={props.periodChangeHandler} value={props.period}>
                            <option value="5">5 Day Period</option>
                            <option value="10">10 Day Period</option>
                            <option value="15">15 Day Period</option>
                            <option value="20">20 Day Period</option>
                            <option value="25">25 Day Period</option>
                            <option value="30">30 Day Period</option>
                            <option value="35">35 Day Period</option>
                            <option value="40">40 Day Period</option>
                            <option value="45">45 Day Period</option>
                            <option value="50">50 Day Period</option>
                        </select>
                    </div>
                </MediaQuery>
                    {/* <i class="fa-solid fa-user"></i> */}
                    <MenuButton dataClickHandler={props.dataClickHandler}
                                performanceClickHandler={props.performanceClickHandler}
                                aboutClickHandler={props.aboutClickHandler} />

                </div>
    );
};

export default NavBar;