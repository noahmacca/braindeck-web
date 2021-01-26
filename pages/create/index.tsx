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
import { useDb } from '../../hooks/useDb';
import dbUtils from '../../lib/dbUtils';
import { useEffect, useState } from "react";

export async function getStaticProps() {
    const user = getUserById('user1');
    const userCreatedLps = getCreatedLearningPathsForUser(user.data);
    const testLp = getLearningPathByIdTest('appleTest1');
    return {
        props: {
            userCreatedLps,
            testLp
        }
    }
}

const testLearningResource = {
    learningResourceId: 'x6jFwu3nEQHgfY6OYB1n',
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

// const testLpId = 'x6jFwu3nEQHgfY6OYB1n';

export default function Create({ userCreatedLps, testLp }) {
    // Page layout
    // Show all of the user's created learning paths. Can edit each one, and create new ones.
    useRequireAuth();

    const auth = useRequireAuth();
    const db = useDb();
    console.log('Create db', db);
    console.log('Create auth', auth);

    const addTestLp = () => {
        console.log('hello');
        db.createLearningPath(testLp.data).then((res) => {
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
                        <button onClick={() => addTestLp()} className="m-3 p-4 bg-red-200 font-semibold rounded-md">Add sample LearningPath</button>
                        {/* <button onClick={() => addtestLr()} className="m-3 p-4 bg-red-200 font-semibold rounded-md">Add sample LearningResource</button> */}
                        <div>All Lps:</div>
                        {
                            db.learningPaths && db.learningPaths.map((lp) => (
                                <div key={`${lp.id}`}>
                                    {lp.data.title} ({lp.id})
                                    <button onClick={() => db.deleteLearningPath(lp.id)} className="m-2 p-1 bg-red-200 rounded-md">Delete</button>
                                </div>
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