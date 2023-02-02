import styles from './Spinner.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import { faCircleNotch, faDharmachakra } from '@fortawesome/free-solid-svg-icons';

const Spinner = (props) => {
    fontawesome.library.add(faCircleNotch, faDharmachakra);
    
    return (
        <div className={styles.spinnerbox} >
            <FontAwesomeIcon className={styles.spinner} icon="fas fa-circle-notch fa-spin" size="6x" />
            {/* <FontAwesomeIcon className={styles.spinner} icon="fas fa-dharmachakra fa-spin" size="6x" /> */}
        </div>
    );
};

export default Spinner;