import { CheckSquareFill, Check } from 'react-bootstrap-icons';
import { useState } from 'react';
import LearningPathSummary from './LearningPathSummary';
import { useDb } from '../hooks/useDb';
import { LearningPathUser, LearningConcept, LearningResource, UserInputLearningPathData } from '../hooks/types';
import FormModal from '../components/forms/FormModal';
import LearningConceptForm from '../components/forms/LearningConceptForm'
import LearningConceptView from './LearningConceptView';
import StarRating from './StarRating';

function renderLearningResource(learningResource: LearningResource, idx: string, setLearningResourceComplete: Function) {
    const db = useDb();
    const isComplete = db.user.learningResources?.some(uLr => (uLr.id === learningResource.id) && !!uLr.isCompleted);

    return (
        <div className="p-3 mx-3 bg-gray-50 mb-3 rounded-lg">
            <div className="text-xl mb-1">
                {`${idx} `}<a href={`${learningResource.url}`}>{`${learningResource.title}`}</a>
            </div>
            <div className="text-sm mb-4">
                {learningResource.author}{' '}
                <span className="capitalize ml-2 text-xs p-1 rounded-lg bg-indigo-100 text-indigo-700 font-light">
                    {learningResource.format.toLowerCase()}
                </span>{' '}
                {
                    learningResource.difficulty === "EASY" ?
                        <span className="capitalize text-xs p-1 ml-2 rounded-lg bg-green-100 text-green-700 font-light">
                            {learningResource.difficulty.toLowerCase()}
                        </span> :
                        <span className="capitalize text-xs p-1 ml-2 rounded-lg bg-yellow-100 text-yellow-700 font-light">
                            {learningResource.difficulty.toLowerCase()}
                        </span>
                }
            </div>
            <div className="pb-2">
                {learningResource.description && <div className="text-sm font-medium">Description <span className="font-light">{learningResource.description}</span></div>}
                {learningResource.highlight && <div className="text-sm font-medium">Highlight <span className="font-light">{learningResource.highlight}</span></div>}
            </div>
            <div>
                {
                    !isComplete ?
                        <div className="rounded p-1 mt-1 flex w-28 text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-pointer" onClick={() => setLearningResourceComplete(learningResource.id, true)}>
                            <div className="mx-auto flex">
                                <span className="text-sm">Complete</span>
                                <Check className="ml-2 text-gray-500" size={20} />
                            </div>
                        </div> :
                        <div className="rounded p-1 mt-1 flex w-28 text-green-700 bg-green-100 hover:bg-green-200 cursor-pointer" onClick={() => setLearningResourceComplete(learningResource.id, false)}>
                            <div className="mx-auto flex">
                                <span className="text-sm">Completed</span>
                                <CheckSquareFill className="ml-2 text-green-500" size={20} />
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

const renderAddLearningConcept = (lpId: string, shouldShowCreateModal: boolean, setShouldShowCreateModal: Function) => {
    return (
        <div>
            <div
                className="w-44 mx-auto mt-6 rounded-md text-center py-3 font-medium text-lg text-gray-50 bg-green-600 hover:bg-green-500 cursor-pointer"
                onClick={() => setShouldShowCreateModal(true)}
            >
                Add New Unit
            </div>
            <FormModal
                title="Create Unit"
                shouldShowModal={shouldShowCreateModal}
                dismissModal={() => setShouldShowCreateModal(false)}
            >
                <LearningConceptForm
                    dismiss={() => setShouldShowCreateModal(false)}
                    lpId={lpId}
                />
            </FormModal>
        </div>
    )
}

function renderLearningConcepts(lp: LearningPathUser, setLearningResourceComplete: Function, isCreator: boolean) {
    const [shouldShowCreateModal, setShouldShowCreateModal] = useState(false);
    const learningConcepts = lp.data.learningConcepts
    return (
        <div>
            {
                learningConcepts.length === 0 ?
                    <div className="font-light text-gray-700 p-2 text-lg">No learning units yet. Add one!</div>
                    :
                    <span>
                        {learningConcepts.map((learningConcept, conceptIdx) => (
                            <div key={`${learningConcept.id}-concept`}>
                                <LearningConceptView
                                    lp={lp}
                                    lc={learningConcept}
                                    conceptIdx={conceptIdx}
                                />
                            </div>
                        ))
                        }
                    </span>
            }
            {
                isCreator === true ?
                    renderAddLearningConcept(lp.id, shouldShowCreateModal, setShouldShowCreateModal)
                    : null
            }
        </div>
    )
}

const renderCourseCompletePanel = (lp: LearningPathUser, userRating: number, setLpRating: Function) => {
    return (
        <div className="bg-gray-100 px-4 pt-3 pb-1 rounded-lg md:mx-4 my-2 items-center text-gray-700">
            <div className="mb-2">
                <div className="text-2xl pb-1 font-medium text-gray-800">Congratulations!</div>
                <div className="text-md pb-1 font-light text-gray-600">You have finished this course.</div>
            </div>
            <div className="p-3 md:mx-3 bg-white mb-2 rounded-lg">
                <div className="text-xl mb-2">
                    Your rating
                </div>
                <StarRating
                    size={32}
                    numStars={userRating}
                    isClickable={lp.userData.progress === 1.0}
                    cb={(numStars: number) => { setLpRating(numStars) }}
                />

            </div>
        </div>
    )
}

export default function LearningPathView({ lpId }: { lpId: string }) {
    const db = useDb();
    const lp: LearningPathUser = db.userLearningPaths.filter((uLp) => uLp.id === lpId)[0];
    const setLearningResourceComplete = (lrId: string, isComplete: boolean) => {
        db.setLearningResourceComplete({
            uId: db.user.uid,
            lrId,
            isComplete
        });
    }

    const setLpRating = (rating: number) => db.setLpRating({
        rating,
        lpId: lp.id,
        uId: db.user.uid
    });

    return (
        <div>
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto p-6 max-w-4xl">
                    <LearningPathSummary
                        lp={lp}
                        isCompact={false}
                    />
                    {renderLearningConcepts(lp, setLearningResourceComplete, lp.userData.isCreator)}
                    {
                        lp.userData.progress === 1.0 ?
                            renderCourseCompletePanel(lp, lp.userData.rating, setLpRating)
                            :
                            null
                    }
                </div>
            </div>
        </div>
    )
}