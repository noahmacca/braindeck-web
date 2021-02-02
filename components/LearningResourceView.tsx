import { CheckSquareFill, Check } from 'react-bootstrap-icons';
import { LearningPathUser, LearningResource,  } from '../hooks/types';
import { useState } from 'react';
import { useDb } from '../hooks/useDb';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import LearningConceptForm from './forms/LearningConceptForm';
import FormModal from './forms/FormModal';

export default function LearningResourceView({lp, lr, resourceIdx}: {lp: LearningPathUser, lr: LearningResource, resourceIdx: number}) {
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
        <div className="p-3 mx-3 bg-gray-50 mb-3 rounded-lg">
            {
                lp.userData.isCreator === true ?
                    <span>
                        <Trash className="mr-5 cursor-pointer float-right text-gray-400" size={20} onClick={() => alert('delete resource')} />
                        <PencilSquare className="mr-7 cursor-pointer float-right text-gray-400" size={20} onClick={() => setShouldShowLrEditModal(true)} />
                    </span>
                    : undefined
            }
            <div className="text-xl mb-1">
                {`${resourceIdx} `}<a href={`${lr.url}`}>{`${lr.title}`}</a>
            </div>
            <div className="text-sm mb-4">
                {lr.author}{' '}
                <span className="capitalize ml-2 text-xs p-1 rounded-lg bg-indigo-100 text-indigo-700 font-light">
                    {lr.format.toLowerCase()}
                </span>{' '}
                {
                    lr.difficulty === "EASY" ?
                        <span className="capitalize text-xs p-1 ml-2 rounded-lg bg-green-100 text-green-700 font-light">
                            {lr.difficulty.toLowerCase()}
                        </span> :
                        <span className="capitalize text-xs p-1 ml-2 rounded-lg bg-yellow-100 text-yellow-700 font-light">
                            {lr.difficulty.toLowerCase()}
                        </span>
                }
            </div>
            <div className="pb-2">
                {lr.description && <div className="text-sm font-medium">Description <span className="font-light">{lr.description}</span></div>}
                {lr.highlight && <div className="text-sm font-medium">Highlight <span className="font-light">{lr.highlight}</span></div>}
            </div>
            <div>
                {
                    !isComplete ?
                        <div className="rounded p-1 mt-1 flex w-28 text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-pointer" onClick={() => setLearningResourceComplete(lr.id, true)}>
                            <div className="mx-auto flex">
                                <span className="text-sm">Complete</span>
                                <Check className="ml-2 text-gray-500" size={20} />
                            </div>
                        </div> :
                        <div className="rounded p-1 mt-1 flex w-28 text-green-700 bg-green-100 hover:bg-green-200 cursor-pointer" onClick={() => setLearningResourceComplete(lr.id, false)}>
                            <div className="mx-auto flex">
                                <span className="text-sm">Completed</span>
                                <CheckSquareFill className="ml-2 text-green-500" size={20} />
                            </div>
                        </div>
                }
            </div>
            <FormModal
                title="Edit Concept"
                shouldShowModal={shouldShowLrEditModal}
                dismissModal={() => setShouldShowLrEditModal(false)}
            >
                <LearningConceptForm
                    dismiss={() => setShouldShowLrEditModal(false)}
                    lpId={lp.id}
                    // lrId={lc.id}
                    // initialData={{
                    //     title: lc.title,
                    //     description: lc.description
                    // }}
                />
            </FormModal>
        </div>
    )
}