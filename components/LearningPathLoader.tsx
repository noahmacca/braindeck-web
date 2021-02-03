import Spinner from './icons/Spinner';
import { useDb } from '../hooks/useDb';

const LearningPathLoader = ({ children }): JSX.Element => {
    const db = useDb();
    return (
        <div>
            {
                (db.userLearningPaths.length === 0) ?
                    <div className="flex justify-center my-40">
                        <Spinner width="80" fill="#7C3AED" className="animate-spin" />
                    </div> :
                    children
            }
        </div>

    );
};
export default LearningPathLoader;