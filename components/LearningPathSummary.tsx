import Link from 'next/link'
import { HeartFill, Heart, Trash, PencilSquare } from 'react-bootstrap-icons';
import { useState } from 'react';
import { LearningPathUser } from '../hooks/types';
import { useDb } from '../hooks/useDb';
import LearningPathForm from './forms/LearningPathForm';
import FormModal from '../components/forms/FormModal';
import ConfirmationForm from './forms/ConfirmationForm';
import StarRating from './StarRating';

export default function LearningPathSummary({ lp }: { lp: LearningPathUser }) {
    const [shouldShowEditModal, setShouldShowEditModal] = useState(false);
    const [shouldShowConfirmDeleteModal, setShouldShowConfirmDeleteModal] = useState(false);
    const learningPath = lp.data;
    const db = useDb();
    const setLpFavorite = (isFavorite: boolean) => db.setLpFavorite({
        isFavorite,
        lpId: lp.id,
        uId: db.user.uid,
    })

    const setLpRating = (rating: number) => db.setLpRating({
        rating,
        lpId: lp.id,
        uId: db.user.uid
    });

    return (
        <div>
            <hr />
            <div className="max-w-6xl p-1 md:px-5 mx-auto">
                <div className="my-2 text-md text-gray-600">{lp.data.subject}</div>
            </div>
            <div className="bg-indigo-900">
                <div className="max-w-6xl mx-auto py-4">
                    <div className="p-3 md:px-5 md:py-10 items-center text-gray-100">
                        <div className="grid grid-cols-10 gap-2">
                            <div className="col-span-6">
                                <div>
                                    <Link href={`/learn/${lp.id}`}>
                                        <div className="text-5xl pb-5 font-semibold tracking-tight text-gray-50 cursor-pointer">{learningPath.title}</div>
                                    </Link>
                                </div>
                                <div className="flex flex-wrap md:x-1 text-md text-gray-100">
                                    <span className="flex pr-1 md:pr-3">
                                        <StarRating
                                            size={19}
                                            numStars={Math.round(lp.data.avgRating)}
                                            isClickable={lp.userData.progress === 1.0}
                                            cb={(numStars: number) => { setLpRating(numStars) }}
                                        />
                                        <span className="pl-3 text-2xl text-yellow-400">{Math.round(lp.data.avgRating * 10) / 10}</span>
                                        <span className="pl-3 text-lg my-auto">{lp.data.countReviews} rating{lp.data.countReviews === 1 ? '' : 's'}</span>
                                    </span>
                                </div>
                                <div className="font-light text-lg py-4">{lp.data.author.name} {lp.userData.isCreator === true ? '(You)' : undefined}</div>
                                <div className="my-4">
                                    {
                                        db.user ?
                                            lp.userData.isFavorite ?
                                                <div onClick={() => setLpFavorite(false)}>
                                                    <div className="text-center mb-6 rounded-md text-indigo-800 text-xl hover:bg-white bg-red-50 p-3 w-36 cursor-pointer">
                                                        Favorited
                                                    </div>
                                                    <span className="flex items-center">
                                                        <span className="pr-2 align-middle cursor-pointer">
                                                            <HeartFill className="text-red-600" size={22} />
                                                        </span>
                                                        <span className="font-bold pr-1">{lp.data.countFavorite}</span> already favorited
                                            </span>
                                                </div>
                                                :
                                                <div onClick={() => setLpFavorite(true)}>
                                                    <div className="text-center mb-6 rounded-md text-indigo-800 text-xl p-3 w-36 hover:bg-red-50 bg-white cursor-pointer">
                                                        Favorite
                                            </div>
                                                    <span className="flex items-center">
                                                        <span className="pr-2 align-middle cursor-pointer">
                                                            <Heart className="text-red-600" size={22} />
                                                        </span>
                                                        <span className="font-bold pr-1">{lp.data.countFavorite}</span> already favorited
                                            </span>
                                                </div>
                                            :
                                            <Link href="/login">
                                                <div>
                                                    <div className="text-center mb-6 rounded-md text-indigo-800 text-xl p-3 w-36 hover:bg-red-50 bg-white cursor-pointer">
                                                        Favorite
                                            </div>
                                                    <span className="flex">
                                                        <span className="flex md:pr-1 align-middle cursor-pointer">
                                                            <Heart className="text-red-600" size={22} />
                                                        </span>
                                                        <span className="font-bold pr-1">{lp.data.countFavorite}</span> already favorited
                                            </span>
                                                </div>
                                            </Link>
                                    }
                                </div>
                                {
                                    (lp.userData.isFavorite || lp.userData.progress > 0.0) &&
                                        <div className="text-lg mb-2 font-medium">{Math.round(lp.userData.progress * 100)}%{' '}
                                            <span className="font-light">complete</span>
                                        </div>
                                }
                                {
                                    lp.userData.isCreator === true ?
                                        <div className="pt-4 text-left">
                                            <PencilSquare className="inline-block mr-5 mt-2 cursor-pointer text-gray-200 hover:text-gray-50" size={20} onClick={() => setShouldShowEditModal(true)} />
                                            <Trash className="inline-block mr-5 mt-2 cursor-pointer text-gray-200 hover:text-gray-50" size={20} onClick={() => setShouldShowConfirmDeleteModal(true)} />
                                        </div>
                                        : undefined
                                }
                            </div>
                            <div className="col-span-4">
                                <div className="bg-white text-gray-700 p-6 rounded-md">
                                    <div className="pb-5">
                                        <div className="text-md pb-1 font-medium">In this learning path, you will</div>
                                        <div className="text-md font-light">{lp.data.learningGoal}</div>
                                    </div>
                                    <div className="pb-5">
                                        <div className="text-md pb-1 font-medium">Background Knowledge</div>
                                        <div className="text-md font-light">{lp.data.background}</div>
                                    </div>
                                    <hr />
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <div>
                                            <div className="mb-2 font-medium">Time{' '}
                                                <span className="font-light">{lp.data.duration}</span>
                                            </div>
                                            <div className="mb-2 font-medium">Difficulty{' '}
                                                <span className="font-light">{lp.data.difficulty}</span>
                                            </div>
                                            <div className="font-medium">Updated{' '}
                                                <span className="font-light">{new Date(lp.data.updated).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-2 font-medium">Resources{' '}
                                                <div className="font-light">
                                                    {
                                                        Object.keys(lp.userData.countByResourceFormat).map((format) => {
                                                            const count = lp.userData.countByResourceFormat[format];
                                                            return (
                                                                <div key={`${format}`}>
                                                                    {count} {format.toLowerCase()}{count !== 1 ? 's' : ''}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <FormModal
                    title="Edit Learning Path"
                    shouldShowModal={shouldShowEditModal}
                    dismissModal={() => setShouldShowEditModal(false)}
                >
                    <LearningPathForm
                        dismiss={() => setShouldShowEditModal(false)}
                        initialData={{
                            title: lp.data.title,
                            subject: lp.data.subject,
                            learningGoal: lp.data.learningGoal,
                            background: lp.data.background,
                            difficulty: lp.data.difficulty,
                            duration: lp.data.duration
                        }}
                        lpId={lp.id}
                    />
                </FormModal>
                <FormModal
                    title="Delete Learning Path?"
                    shouldShowModal={shouldShowConfirmDeleteModal}
                    dismissModal={() => setShouldShowConfirmDeleteModal(false)}
                >
                    <ConfirmationForm
                        info={lp.data.title}
                        dismissAction={() => setShouldShowConfirmDeleteModal(false)}
                        confirmAction={() => {
                            db.deleteLearningPath(lp.id);
                            setShouldShowConfirmDeleteModal(false);
                        }}
                    />
                </FormModal>
            </div>
        </div>
    )
}