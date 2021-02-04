import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import { useDb } from '../../hooks/useDb';
import { useRequireAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import LearningPathLoader from '../../components/LearningPathLoader'
import FormModal from '../../components/forms/FormModal'
import UserInfoForm from '../../components/forms/UserInfoForm'

export default function ProfileIndex() {
    const db = useDb();
    useRequireAuth();
    const [shouldShowEditModal, setShouldShowEditModal] = useState(false);

    return (
        <div>
            <PageHead title="BrainDeck Home" />
            <NavBar />
            <LearningPathLoader>
                <div className="relative bg-white overflow-hidden">
                    <div className="mx-auto px-6 mt-6 max-w-4xl">
                        <div className="container mb-6 md:mb-10 text-gray-700">
                            <div className="mt-3 text-2xl font-semibold">Welcome back, {db.user?.name}!</div>
                            <div className="mt-3 text-l font-semibold">Info</div>
                            <div className="mx-3 mb-3">
                                <div className='font-light'>{db.user?.email}</div>
                                {db.user?.created &&
                                    <div className='font-light'>Joined on {new Date(db.user.created).toLocaleDateString('en-US')}
                                    </div>
                                }
                            </div>
                            <div className="mt-3 text-l font-semibold">Learning Paths</div>
                            <div className="mx-3 mb-3">
                                <div className="font-light">Favorited: {(db.userLearningPaths.filter((uLp) => db.user?.learningPaths.some((userLp) => (userLp.id === uLp.id) && (userLp.isFavorited === true)))).length}</div>
                                <div className="font-light">Completed: {(db.userLearningPaths.filter((uLp) => db.user?.learningPaths.some((userLp) => (userLp.id === uLp.id) && (uLp.userData.progress >= 1.0)))).length}</div>
                            </div>
                            <div className="mt-3 text-l font-semibold">Favorite Topics</div>
                            <div className="mx-3 mb-3 font-light">
                                {
                                    db.user?.favoriteTopics && db.user?.favoriteTopics.length > 0 ?
                                        db.user?.favoriteTopics.map((favoriteTopic) => (
                                            <div key={`${favoriteTopic}`} className="capitalize">
                                                {favoriteTopic}
                                            </div>
                                        ))
                                        :
                                        <div className="mx-3 mb-3 font-light">No favorites yet!</div>
                                }
                            </div>
                            <div
                                className="my-2 px-2 py-1 font-normal bg-green-800 hover:bg-green-600 text-white w-24 text-center rounded-md cursor-pointer"
                                onClick={() => setShouldShowEditModal(true)}
                            >Edit</div>
                        </div>
                    </div>
                </div>
                <FormModal
                    title="Edit Profile Info"
                    shouldShowModal={shouldShowEditModal}
                    dismissModal={() => setShouldShowEditModal(false)}
                >
                    <UserInfoForm
                        dismiss={() => setShouldShowEditModal(false)}
                        initialData={{
                            uId: db.user?.uid,
                            name: db.user?.name,
                            favoriteTopics: db.user?.favoriteTopics
                        }}
                    />
                </FormModal>
            </LearningPathLoader>
        </div>
    )
}