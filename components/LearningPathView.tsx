import { CheckSquareFill, Check } from 'react-bootstrap-icons';
import { useState } from 'react';
import LearningPathSummary from './LearningPathSummary';
import { useDb } from '../hooks/useDb';
import { LearningPathUser, LearningConcept, LearningResource, UserInputLearningPathData } from '../hooks/types';
import FormModal from '../components/forms/FormModal';
import LearningConceptForm from '../components/forms/LearningConceptForm'
import LearningConceptView from './LearningConceptView';
import CourseCompletePanel from './CourseCompletePanel';

const renderAddLearningConcept = (lpId: string, shouldShowCreateModal: boolean, setShouldShowCreateModal: Function) => {
    return (
        <div>
            <div
                className="w-44 mx-auto my-6 rounded-md text-center py-3 font-medium text-lg text-gray-50 bg-green-600 hover:bg-green-500 cursor-pointer"
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

    console.log('LearningPathView', lp, db.user);

    return (
        <div>
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto p-6 max-w-4xl">
                    {
                        lp ?
                            <div>
                                <LearningPathSummary
                                    lp={lp}
                                    isCompact={false}
                                />
                                {renderLearningConcepts(lp, setLearningResourceComplete, lp.userData.isCreator)}
                                <CourseCompletePanel
                                    lp={lp}
                                />
                            </div>
                            :
                            <div className="mt-10 text-gray-600 text-md text-center">Learning Path not found. It may have been deleted by the creator.</div>
                    }
                </div>
            </div>
        </div>
    )
}