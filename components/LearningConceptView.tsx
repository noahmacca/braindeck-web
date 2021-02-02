import { LearningPathUser, LearningConcept } from '../hooks/types';
import { useState } from 'react';
import { useDb } from '../hooks/useDb';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import FormModal from './forms/FormModal';
import LearningConceptForm from './forms/LearningConceptForm'

export default function LearningConceptView({lp, lc, conceptIdx}: {lp: LearningPathUser, lc: LearningConcept, conceptIdx: number}) {
    const [shouldShowEditModal, setShouldShowEditModal] = useState(false);
    const db = useDb();

    return (
        <div className="bg-white mx-5 mt-5 items-center text-gray-700">
            {
                lp.userData.isCreator === true ?
                    <span>
                        <Trash className="mr-5 cursor-pointer float-right text-gray-400" size={20} onClick={() => db.deleteLearningConcept(lp.id, lc.id)} />
                        <PencilSquare className="mr-7 cursor-pointer float-right text-gray-400" size={20} onClick={() => setShouldShowEditModal(true)} />
                    </span>
                    : undefined
            }
            <div className="text-2xl pb-1 font-semibold text-gray-800">{`${conceptIdx + 1}. ${lc.title}`}</div>
            <div>
                {
                    lc.learningResources.map((learningResource, idxResource) => {
                        return (
                            <div key={`${learningResource.id}-content`}>
                                <div>{ learningResource.id }</div>
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
                    lcId={lc.id}
                    initialData={{
                        title: lc.title,
                        description: lc.description
                    }}
                />
            </FormModal>
        </div>
    )
}