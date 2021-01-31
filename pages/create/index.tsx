import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import {
    getLearningPathByIdTest
} from '../../lib/learningPaths';
import LpListSection from "../../components/LpListSection";
import { useRequireAuth } from '../../hooks/useAuth';
import { useDb } from '../../hooks/useDb';
import LearningPathLoader from '../../components/LearningPathLoader';

export async function getStaticProps() {
    const testLp = getLearningPathByIdTest('appleTest1');
    return {
        props: {
            testLp
        }
    }
}

export default function Create({ testLp }) {
    // Page layout
    // Show all of the user's created learning paths. Can edit each one, and create new ones.
    useRequireAuth();
    const db = useDb();

    const addTestLp = () => {
        const newLp = testLp;
        newLp.data.author = {
            uid: db.user.uid,
            name: db.user.name
        }
        db.createLearningPath(newLp.data).then((res) => {
            console.log('done creating learning path', res);
        });
    }

    return (
        <div>
            <PageHead title="BrainDeck Create" />
            <NavBar />
            <LearningPathLoader>
                <div className="relative bg-white overflow-hidden">
                    <div className="mx-auto px-6 mt-6 max-w-4xl">
                        <div className="container mb-4 md:mb-6">
                            <button onClick={() => addTestLp()} className="m-3 p-4 bg-red-200 font-semibold rounded-md">Add sample LearningPath</button>
                            <button onClick={() => db.setUserName({ uId: db.user.uid, name: 'nomotest4' })} className="m-3 p-4 bg-red-200 font-semibold rounded-md">Update Name</button>
                            <div className="container mb-4 md:mb-6">
                                <h1 className="mb-3">Your Created Learning Paths</h1>
                                <LpListSection lps={db.userLearningPaths} />
                            </div>
                        </div>
                    </div>
                </div>
            </LearningPathLoader>
        </div>
    )
}