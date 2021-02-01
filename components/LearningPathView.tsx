import { CheckSquareFill, Check } from 'react-bootstrap-icons';
import { useState } from 'react';
import LearningPathSummary from './LearningPathSummary';
import { useDb } from '../hooks/useDb';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import { LearningPathUser, LearningConcept, LearningResource, UserInputLearningPathData } from '../hooks/types';
import FormModal from '../components/forms/FormModal';
import LearningConceptForm from '../components/forms/LearningConceptForm'

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

const renderLearningConceptNew = (lpId: string, shouldShowCreateModal: boolean, setShouldShowCreateModal: Function) => {
    return (
        <div>
            <div
                className="rounded-md py-2 px-3 font-light text-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
                onClick={() => setShouldShowCreateModal(true)}
            >
                New Concept
            </div>
            <FormModal
                title="Create Learning Concept"
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
    const [shouldShowEditModal, setShouldShowEditModal] = useState(false);
    const [shouldShowCreateModal, setShouldShowCreateModal] = useState(false);

    const learningConcepts = lp.data.learningConcepts
    const db = useDb();

    return (
        <div>
            {
                learningConcepts.length === 0 ?
                    <div className="font-light text-gray-700 p-2 text-lg">No learning paths yet!</div>
                    :
                    <span>
                        {learningConcepts.map((learningConcept, idxConcept) => {
                            return (
                                <div className="bg-white mx-5 mt-5 items-center text-gray-700" key={`${learningConcept.id}-concept`}>
                                    {
                                        lp.userData.isCreator === true ?
                                            <span>
                                                <Trash className="mr-5 cursor-pointer float-right text-gray-400" size={20} onClick={() => db.deleteLearningConcept(lp.id, learningConcept.id)} />
                                                <PencilSquare className="mr-7 cursor-pointer float-right text-gray-400" size={20} onClick={() => setShouldShowEditModal(true)} />
                                            </span>
                                            : undefined
                                    }
                                    <div className="text-2xl pb-1 font-semibold text-gray-800">{`${idxConcept + 1}. ${learningConcept.title}`}</div>
                                    <div>
                                        {
                                            learningConcept.learningResources.map((learningResource, idxResource) => {
                                                return (
                                                    <div key={`${learningResource.id}-content`}>
                                                        { renderLearningResource(learningResource, `${idxConcept + 1}.${idxResource + 1}.`, setLearningResourceComplete)}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <FormModal
                                        title="Edit Learning Concept"
                                        shouldShowModal={shouldShowEditModal}
                                        dismissModal={() => setShouldShowEditModal(false)}
                                    >
                                        <LearningConceptForm
                                            dismiss={() => setShouldShowEditModal(false)}
                                            lpId={lp.id}
                                            lcId={learningConcept.id}
                                            initialData={{
                                                title: learningConcept.title,
                                                description: learningConcept.description
                                            }}
                                        />
                                    </FormModal>
                                </div>
                            )
                        })}
                    </span>
            }
            {
                isCreator === true ?
                    renderLearningConceptNew(lp.id, shouldShowCreateModal, setShouldShowCreateModal)
                    : null
            }
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
    return (
        <div>
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto p-6 max-w-4xl">
                    <LearningPathSummary
                        lp={lp}
                        isCompact={false}
                    />
                    {renderLearningConcepts(lp, setLearningResourceComplete, lp.userData.isCreator)}
                </div>
            </div>
        </div>
    )
}