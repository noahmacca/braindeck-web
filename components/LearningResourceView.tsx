import { CheckSquareFill } from 'react-bootstrap-icons';
import { LearningPathUser, LearningConcept, LearningResource  } from '../hooks/types';
import { useState } from 'react';
import { useDb } from '../hooks/useDb';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import LearningResourceForm from './forms/LearningResourceForm';
import FormModal from './forms/FormModal';

export default function LearningResourceView({lp, lc, lr}: {lp: LearningPathUser, lc: LearningConcept, lr: LearningResource}) {
    const [shouldShowLrEditModal, setShouldShowLrEditModal] = useState(false);
    const db = useDb();
    const isComplete = db.user.learningResources?.some(uLr => (uLr.id === lr.id) && !!uLr.isCompleted);
    const setLearningResourceComplete = (lrId: string, isComplete: boolean) => {
        db.setLearningResourceComplete({
            uId: db.user.uid,
            lrId,
            isComplete
        });
    }

    return (
        <div className="p-3 mx-3 bg-white mb-2 rounded-lg">
            {
                lp.userData.isCreator === true ?
                    <span>
                        <Trash className="mr-5 mt-2 cursor-pointer float-right text-gray-400" size={16} onClick={() => db.deleteLearningResource(lp.id, lc.id, lr.id)} />
                        <PencilSquare className="mr-5 mt-2 cursor-pointer float-right text-gray-400" size={16} onClick={() => setShouldShowLrEditModal(true)} />
                    </span>
                    : undefined
            }
            <div className="text-xl mb-2">
                <a href={`${lr.url}`}>{`${lr.title}`}</a>
            </div>
            <div className="text-sm mb-4">
                By {lr.author}{' '}
                <span className="capitalize ml-2 bg-gray-100 text-gray-600 rounded-md px-2 py-1 font-medium">
                    {lr.format.toLowerCase()}
                </span>{' '}
                <span className="capitalize bg-gray-100 text-gray-600 rounded-md px-2 py-1 ml-2 font-medium">
                    {lr.difficulty.toLowerCase()}
                </span>
            </div>
            <div className="pb-2">
                {lr.description && <div className="text-sm font-medium">Description <span className="font-light">{lr.description}</span></div>}
                {lr.highlight && <div className="text-sm font-medium">Highlight <span className="font-light">{lr.highlight}</span></div>}
            </div>
            <div>
                {
                    !isComplete ?
                        <div className="rounded-md border p-1 mt-1 flex w-28 text-gray-700 hover:bg-green-100 cursor-pointer" onClick={() => setLearningResourceComplete(lr.id, true)}>
                            <div className="mx-auto flex">
                                <span className="text-sm">Complete</span>
                            </div>
                        </div> :
                        <div className="rounded-md border border-green-100 p-1 mt-1 flex w-28 text-gray-700 bg-green-50 cursor-pointer" onClick={() => setLearningResourceComplete(lr.id, false)}>
                            <div className="mx-auto flex">
                                <span className="text-sm">Completed</span>
                                <CheckSquareFill className="ml-2 text-green-500" size={20} />
                            </div>
                        </div>
                }
            </div>
            <FormModal
                title="Edit Resource"
                shouldShowModal={shouldShowLrEditModal}
                dismissModal={() => setShouldShowLrEditModal(false)}
            >
                <LearningResourceForm
                    dismiss={() => setShouldShowLrEditModal(false)}
                    lpId={lp.id}
                    lcId={lc.id}
                    lrId={lr.id}
                    initialData={{
                        title: lr.title,
                        author: lr.author,
                        url: lr.url,
                        format: lr.format,
                        difficulty: lr.difficulty,
                        description: lr.description,
                        highlight: lr.highlight,
                    }}
                />
            </FormModal>
        </div>
    )
}