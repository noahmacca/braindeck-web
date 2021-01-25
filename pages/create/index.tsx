import NavBar from "../../components/NavBar";
import firebase from 'firebase/app';
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
    const testLp = getLearningPathByIdTest('deepLearningOverviewTest');
    return {
        props: {
            userCreatedLps,
            testLp
        }
    }
}

const testLearningResource = {
    learningResourceId: 'L4WEUZsuf2MZtR7pccBf',
    data: {
        title: "Apple ARM Processor vs Intel x86 Performance and Power Efficiency - Is the MAC Doomed?",
        authorId: "Graphically Challenged",
        url: "https://www.youtube.com/watch?v=MSifxEGivbY",
        format: "VIDEO",
        difficulty: "EASY",
        description: "It's important to understand why the two architectures are so different",
        highlight: "2:00 - 3:35"
    }
}

export default function Create({ userCreatedLps, testLp }) {
    // Page layout
    // Show all of the user's created learning paths. Can edit each one, and create new ones.
    // useRequireAuth();

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

    const addtestLr = () => {
        dbUtils.createLearningResource(testLearningResource.data).then((res) => {
            console.log('done creating learning resource', res.id);
            // Append this to the correct part of the learningPath
            dbUtils.updateLearningPath('L4WEUZsuf2MZtR7pccBf', {
                'learningConcepts.0.learningResourceIds': firebase.firestore.FieldValue.arrayUnion(res.id)
            }).then((res) => {
                console.log('done updating doc', res);
            })
        })
    }

    return (
        <div>
            <PageHead title="BrainDeck Create" />
            <NavBar />
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto px-6 mt-6 max-w-4xl">
                    <div className="container mb-4 md:mb-6">
                        <button onClick={() => addTestLp()} className="m-3 p-4 bg-red-200 font-semibold rounded-md">Add sample LearningPath</button>
                        <button onClick={() => addtestLr()} className="m-3 p-4 bg-red-200 font-semibold rounded-md">Add sample LearningResource</button>
                        <div>All Lps:</div>
                        {
                            learningPaths && learningPaths.map((lp) => (
                                <div key={`${lp.id}`}>{lp.title}</div>
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