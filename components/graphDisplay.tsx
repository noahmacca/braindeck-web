import styles from './GraphDisplay.module.css';
import { ArrowRight } from 'react-bootstrap-icons';

export default function GraphDisplay() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                Here is a learning graph
            </div>
            <div className="alert alert-primary">
                <ArrowRight color="royalblue" size={96} /> Alert
            </div>
        </div>
    )
}