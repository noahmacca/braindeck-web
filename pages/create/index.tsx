import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import {
    getCreatedLearningPathsForUser,
    getLearningPathByIdTest
} from '../../lib/learningPaths';
import { getUserById } from '../../lib/user';
import LpListSection from "../../components/LpListSection";
import { useRequireAuth } from '../../hooks/useAuth';
import dbUtils from '../../lib/dbUtils';
import { useEffect, useState } from "react";

export async function getStaticProps() {
    const user = getUserById('user1');
    const userCreatedLps = getCreatedLearningPathsForUser(user.data);
    const testLp = getLearningPathByIdTest('appleTest1');
    console.log(testLp);
    return {
        props: {
            userCreatedLps,
            testLp
        }
    }
}

export default function Create({ userCreatedLps, testLp }) {
    // Page layout
    // Show all of the user's created learning paths. Can edit each one, and create new ones.
    useRequireAuth();

    const [learningPaths, setLearningPaths] = useState(null)
    useEffect(() => {
        dbUtils.getAllLearningPaths().then((res) => {
            console.log('getting all learning paths');
            console.log(res[0]);
            setLearningPaths(res);
        })
    }, []);

    const addTestLp = () => {
        dbUtils.createLearningPath(testLp.data).then((res) => {
            console.log('done creating learning path', res);
        });
    }

    return (
        <div>
            <PageHead title="BrainDeck Create" />
            <NavBar />
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto px-6 mt-6 max-w-4xl">
                    <div className="container mb-4 md:mb-6">
                        <button onClick={() => addTestLp()} className="m-3 p-4 bg-red-200 font-semibold rounded-md">Add sample Lp 1</button>
                        <div>All Lps:</div>
                        {
                            learningPaths && learningPaths.map((lp) => (
                                <div key={`${lp.id}`}>{lp.id}</div>
                            ))
                        }
                        <div className="container mb-4 md:mb-6">
                            <h1 className="mb-3">Your Created Learning Paths</h1>
                            <LpListSection userLps={userCreatedLps} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}