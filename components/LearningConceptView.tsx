import { LearningPathUser, LearningConcept } from '../hooks/types';
import { useState } from 'react';
import { useDb } from '../hooks/useDb';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import FormModal from './forms/FormModal';
import LearningConceptForm from './forms/LearningConceptForm';
import LearningResourceForm from './forms/LearningResourceForm';
import LearningResourceView from './LearningResourceView';

const renderAddLearningResource = (lpId: string, lcId: string, shouldShowCreateModal: boolean, setShouldShowCreateModal: Function) => {
    return (
        <div>
            <div
                className="w-44 rounded-md text-center font-gray-800 py-2 text-md font-medium text-md text-gray-50 bg-green-600 hover:bg-green-500 cursor-pointer"
                onClick={() => setShouldShowCreateModal(true)}
            >
                Add New Resource
            </div>
            <FormModal
                title="Create Resource"
                shouldShowModal={shouldShowCreateModal}
                dismissModal={() => setShouldShowCreateModal(false)}
            >
                <LearningResourceForm
                    dismiss={() => setShouldShowCreateModal(false)}
                    lpId={lpId}
                    lcId={lcId}
                />
            </FormModal>
        </div>
    )
}

export default function LearningConceptView({ lp, lc, conceptIdx }: { lp: LearningPathUser, lc: LearningConcept, conceptIdx: number }) {
    const [shouldShowLrCreateModal, setShouldShowLrCreateModal] = useState(false);
    const [shouldShowLcEditModal, setShouldShowLcEditModal] = useState(false);
    const db = useDb();

    return (
        <div className="bg-gray-100 px-4 py-3 rounded-lg mx-4 my-4 items-center text-gray-700">
            {
                lp.userData.isCreator === true ?
                    <span>
                        <Trash className="mr-7 mt-2 cursor-pointer float-right text-gray-400" size={18} onClick={() => db.deleteLearningConcept(lp.id, lc.id)} />
                        <PencilSquare className="mr-5 mt-2 cursor-pointer float-right text-gray-400" size={18} onClick={() => setShouldShowLcEditModal(true)} />
                    </span>
                    : undefined
            }
            <div className="mb-4">
                <div className="text-2xl pb-1 font-medium text-gray-800">{`${conceptIdx + 1}. ${lc.title}`}</div>
                <div className="text-md pb-1 font-light text-gray-600">{`${lc.description}`}</div>
            </div>
            <div>
                {
                    lc.learningResources.length === 0 ?
                        <div className="font-light text-gray-700 p-2 text-md">No learning resources yet. Add one!</div>
                        :
                        lc.learningResources.map((learningResource, resourceIdx) => {
                            return (
                                <div key={`${learningResource.id}-content`}>
                                    <LearningResourceView
                                        lp={lp}
                                        lc={lc}
                                        lr={learningResource}
                                    />
                                </div>
                            )
                        })
                }
            </div>
            <FormModal
                title="Edit Unit"
                shouldShowModal={shouldShowLcEditModal}
                dismissModal={() => setShouldShowLcEditModal(false)}
            >
                <LearningConceptForm
                    dismiss={() => setShouldShowLcEditModal(false)}
                    lpId={lp.id}
                    lcId={lc.id}
                    initialData={{
                        title: lc.title,
                        description: lc.description
                    }}
                />
            </FormModal>
            {
                lp.userData.isCreator === true ?
                    renderAddLearningResource(lp.id, lc.id, shouldShowLrCreateModal, setShouldShowLrCreateModal)
                    : null
            }
        </div>
    )
}