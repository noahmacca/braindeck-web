import styles from './GraphDisplay.module.css';
import { ArrowRight } from 'react-bootstrap-icons';

export default function GraphDisplay() {
    return (
        <div className={styles.container}>
            <h1>H1 title</h1>
            <h3>H3 title  <small className="text-muted">With faded secondary text</small></h3>

            <p>p tag content</p>
            <div className={styles.content}>
                Here is a learning graph
            </div>
            <div className="alert alert-primary">
                <ArrowRight color="royalblue" size={96} /> Alert
            </div>
        </div>
    )
}