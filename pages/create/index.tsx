import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import LpListSection from "../../components/LpListSection";
import { useRequireAuth } from '../../hooks/useAuth';
import { useDb } from '../../hooks/useDb';
import { useState } from 'react';
import LearningPathLoader from '../../components/LearningPathLoader'
import NewLearningPathForm from '../../components/forms/NewLearningPathForm';
import FormModal from '../../components/forms/FormModal';

export default function CreateIndex() {
    const [shouldShowCreateModal, setShouldShowCreateModal] = useState(false);
    // Page layout
    // Show all of the user's created learning paths. Can edit each one, and create new ones.
    useRequireAuth();
    const db = useDb();

    return (
        <div>
            <PageHead title="BrainDeck Create" />
            <NavBar />
            <LearningPathLoader>
                <div className="relative bg-white overflow-hidden">
                    <div className="mx-auto px-6 mt-6 max-w-4xl">
                        <div className="container mb-4 md:mb-6">
                            <button onClick={() => setShouldShowCreateModal(true)} className="mr-3 p-2 px-3 bg-indigo-200 rounded-md">New</button>
                            <button onClick={() => db.setUserName({ uId: db.user.uid, name: 'nomotest4' })} className="mr-3 mb-3 p-2 px-3 bg-indigo-200 rounded-md">Update Name</button>
                            <div className="container mb-4 md:mb-6">
                                <h1 className="mb-3">Your Created Learning Paths</h1>
                                <LpListSection lps={db.userLearningPaths.filter((uLp) => uLp.userData.isCreator)} />
                            </div>
                        </div>
                    </div>
                </div>
                <FormModal
                    title="New Learning Path"
                    shouldShowModal={shouldShowCreateModal}
                    dismissModal={() => setShouldShowCreateModal(false)}
                >
                    <NewLearningPathForm
                        dismiss={() => setShouldShowCreateModal(false)}
                    />
                </FormModal>
            </LearningPathLoader>
        </div>
    )
}