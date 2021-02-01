import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import {
    getLearningPathByIdTest
} from '../../lib/learningPaths';
import LpListSection from "../../components/LpListSection";
import { useRequireAuth } from '../../hooks/useAuth';
import { useDb } from '../../hooks/useDb';
import { useState } from 'react';
import LearningPathLoader from '../../components/LearningPathLoader'
import NewLearningPathForm from '../../components/forms/NewLearningPathForm';

export async function getStaticProps() {
    const testLp = getLearningPathByIdTest('appleTest1');
    return {
        props: {
            testLp
        }
    }
}

const renderCreateLpModal = (shouldShowModal: boolean, setShouldShowCreateModal: Function) => {
    return (
        <div className={`modal fixed w-full h-full top-0 left-0 flex items-center justify-center transition-opacity ease-in-out ${shouldShowModal ? null : 'opacity-0 pointer-events-none'}`}>
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

            <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">

                <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
                    <svg className="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                    </svg>
                    <span className="text-sm">(Esc)</span>
                </div>

                <div className="modal-content py-4 text-left px-6">
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">Simple Modal!</p>
                        <div className="modal-close cursor-pointer z-50" onClick={() => setShouldShowCreateModal(false)}>
                            <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                            </svg>
                        </div>
                    </div>

                    <NewLearningPathForm />

                    <div className="flex justify-end pt-2">
                        <button className="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2">Action</button>
                        <button className="modal-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400">Close</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default function CreateIndex({ testLp }) {
    const [shouldShowCreateModal, setShouldShowCreateModal] = useState(false);
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
                            <button onClick={() => setShouldShowCreateModal(true)} className="mr-3 p-2 px-3 bg-indigo-200 rounded-md">New</button>
                            <button onClick={() => addTestLp()} className="mr-3 p-2 px-3 bg-indigo-200 rounded-md">New (Sample)</button>
                            <button onClick={() => db.setUserName({ uId: db.user.uid, name: 'nomotest4' })} className="mr-3 mb-3 p-2 px-3 bg-indigo-200 rounded-md">Update Name</button>
                            <div className="container mb-4 md:mb-6">
                                <h1 className="mb-3">Your Created Learning Paths</h1>
                                <LpListSection lps={db.userLearningPaths.filter((uLp) => uLp.userData.isCreator)} />
                            </div>
                        </div>
                    </div>
                </div>
                {renderCreateLpModal(shouldShowCreateModal, setShouldShowCreateModal)}
            </LearningPathLoader>
        </div>
    )
}