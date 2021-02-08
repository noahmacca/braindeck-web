import { LearningPathUser, LearningConcept } from '../hooks/types';
import { useState } from 'react';
import { useDb } from '../hooks/useDb';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import FormModal from './forms/FormModal';
import LearningConceptForm from './forms/LearningConceptForm';
import LearningResourceForm from './forms/LearningResourceForm';
import LearningResourceView from './LearningResourceView';
import ConfirmationForm from './forms/ConfirmationForm';

const renderAddLearningResource = (lpId: string, lcId: string, shouldShowCreateModal: boolean, setShouldShowCreateModal: Function) => {
    return (
        <div>
            <div
                className="w-44 mx-auto rounded-md text-center font-gray-800 py-2 my-4 text-md font-medium text-md text-gray-50 bg-green-600 hover:bg-green-500 cursor-pointer"
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
    const [shouldShowConfirmDeleteModal, setShouldShowConfirmDeleteModal] = useState(false);
    const db = useDb();

    return (
        <div className="pt-10 pb-1 rounded-lg md:mx-4 my-2 text-gray-700">
            <div className="mb-6 text-center">
                <div className="text-4xl pb-1 font-medium text-gray-700 ">{`${conceptIdx + 1}. ${lc.title}`}</div>
                <div className="text-lg pb-1 font-light text-gray-600">{`${lc.description}`}</div>
                {
                    lp.userData.isCreator === true ?
                        <div className="container text-center mt-1 mb-1">
                            <div className="mx-auto">
                                <PencilSquare className="mr-4 inline-block cursor-pointer text-gray-400 hover:text-gray-600" size={20} onClick={() => setShouldShowLcEditModal(true)} />
                                <Trash className="cursor-pointer inline-block text-gray-400 hover:text-gray-600" size={20} onClick={() => setShouldShowConfirmDeleteModal(true)} />
                            </div>
                        </div>
                        : undefined
                }
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
            <FormModal
                title="Delete Unit?"
                shouldShowModal={shouldShowConfirmDeleteModal}
                dismissModal={() => setShouldShowConfirmDeleteModal(false)}
            >
                <ConfirmationForm
                    info={lc.title}
                    dismissAction={() => setShouldShowConfirmDeleteModal(false)}
                    confirmAction={() => db.deleteLearningConcept(lp.id, lc.id)}
                />
            </FormModal>
            <hr className="mx-24 mt-8"/>
        </div>
    )
}