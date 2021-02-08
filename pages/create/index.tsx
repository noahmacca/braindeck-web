import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import LpListSection from "../../components/LpListSection";
import { useRequireAuth } from '../../hooks/useAuth';
import { useDb } from '../../hooks/useDb';
import { useState } from 'react';
import LearningPathLoader from '../../components/LearningPathLoader'
import LearningPathForm from '../../components/forms/LearningPathForm';
import FormModal from '../../components/forms/FormModal';
import SectionHeader from "../../components/SectionHeader";

export default function CreateIndex() {
    const [shouldShowCreateModal, setShouldShowCreateModal] = useState(false);
    // Page layout
    // Show all of the user's created learning paths. Can edit each one, and create new ones.
    useRequireAuth();
    const db = useDb();
    const createdLps = db.userLearningPaths.filter((uLp) => uLp.userData.isCreator)

    return (
        <div>
            <PageHead title="BrainDeck Create" />
            <NavBar />
            <LearningPathLoader>
                <div className="relative bg-white overflow-hidden">
                    <div className="mx-auto px-6 mt-6 max-w-4xl">
                        <div className="container mb-4 md:mb-6">
                            <div className="text-center">
                                <button
                                    onClick={() => setShouldShowCreateModal(true)}
                                    className="mb-16 font-medium text-xl py-4 px-10 text-gray-50 bg-green-600 hover:bg-green-500 rounded-md"
                                >
                                    New Learning Path
                                </button>
                            </div>
                            <div className="container mb-4 md:mb-6">
                                <SectionHeader text="Created Learning Paths" />
                                {
                                    createdLps.length === 0 ?
                                        <div className="font-light text-gray-700 p-2 text-lg text-center">No learning paths created yet. Create one!</div>
                                        :
                                        <LpListSection lps={createdLps} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <FormModal
                    title="New Learning Path"
                    shouldShowModal={shouldShowCreateModal}
                    dismissModal={() => setShouldShowCreateModal(false)}
                >
                    <LearningPathForm
                        dismiss={() => setShouldShowCreateModal(false)}
                    />
                </FormModal>
            </LearningPathLoader>
        </div>
    )
}