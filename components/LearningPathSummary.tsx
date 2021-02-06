import Link from 'next/link'
import { HeartFill, Heart, Trash, PencilSquare } from 'react-bootstrap-icons';
import { useState } from 'react';
import { LearningPathUser } from '../hooks/types';
import { useDb } from '../hooks/useDb';
import LearningPathForm from './forms/LearningPathForm';
import FormModal from '../components/forms/FormModal';
import ConfirmationForm from './forms/ConfirmationForm';
import StarRating from './StarRating';

const renderLpSummaryDetail = ({ lp, progress }:
    {
        lp: LearningPathUser,
        progress: number
    }) => {

    return (
        <div>
            <div className="px-2 pt-3">
                <div className="pb-3">
                    <div className="text-sm font-medium">Outcome</div>
                    <div className="text-md font-light">{lp.data.learningGoal}</div>
                </div>
                <div className="pb-3">
                    <div className="text-sm font-medium">Background Knowledge</div>
                    <div className="text-md font-light">{lp.data.background}</div>
                </div>
                <hr />
                <div className="md:flex md:text-center pt-2">
                    <div className="flex-1 text-sm font-medium">Your Progress{' '}
                        <span className="font-light">{Math.round(progress * 100)}%</span>
                    </div>
                    <div className="flex-1 text-sm font-medium">Created By{' '}
                        <span className="font-light">{lp.data.author.name} {lp.userData.isCreator === true ? '(You)' : undefined}</span>
                    </div>
                    <div className="flex-1 text-sm font-medium">Updated{' '}
                        <span className="font-light">{new Date(lp.data.updated).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const renderInfoChip = (text: string, color: string) => {
    return (
        <span className={`text-sm p-1 px-2 ml-1 md:ml-2 rounded-lg bg-${color}-600 text-gray-50 capitalize`}>
            {text.toLocaleLowerCase()}
        </span>
    )
}

const getChipColor = (type: string, val: string) => {
    const normType = type.toUpperCase();
    const normVal = val.toUpperCase();
    const colorConfig = {
        'DIFFICULTY': {
            'EASY': 'green',
            'MODERATE': 'yellow',
            'HARD': 'red',
            'ADVANCED': 'red'
        },
        'EST_DURATION': {
            'FAST (<1 HR)': 'green',
            'QUICK (<1 HR)': 'green',
            'FAST (1-2 HR)': 'green',
            'MEDIUM (2-5 HR)': 'yellow',
            'LONG (5-10 HR)': 'red',
            'VERY LONG (10-20 HR)': 'red',
        }
    }
    let res = 'gray';
    if (normType in colorConfig) {
        if (normVal in colorConfig[normType]) {
            res = colorConfig[normType][normVal]
        } else {
            console.log('Invalid colorConfig val', normVal);
        }
    } else {
        console.log('Invalid colorConfig type', normType);
    }
    return res
}



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
                <div className="my-2 text-md text-blue-500">{lp.data.subject}</div>
            </div>
            <div className="bg-indigo-900">
                <div className="max-w-6xl mx-auto py-4">
                    <div className="p-3 md:px-5 md:py-10 items-center text-gray-100">
                        {
                            db.user ?
                                lp.userData.isFavorite ?
                                    <div className="float-right mr-2 text-center rounded-md text-gray-50 text-md bg-red-700 p-1 w-28 cursor-pointer" onClick={() => setLpFavorite(false)}>
                                        Favorited
                                    </div>
                                    :
                                    <div className="float-right mr-2 text-center rounded-md text-gray-50 text-md p-1 w-28 bg-red-500 hover:bg-red-700 cursor-pointer" onClick={() => setLpFavorite(true)}>
                                        Favorite
                                    </div>
                                :
                                <Link href="/login">
                                    <div className="float-right mr-2 text-center rounded-md text-gray-50 text-md p-1 w-28 bg-red-500 hover:bg-red-700 cursor-pointer">
                                        Favorite
                                    </div>
                                </Link>
                        }
                        {
                            lp.userData.isCreator === true ?
                                <span>
                                    <Trash className="mr-5 mt-2 cursor-pointer float-right text-gray-200 hover:text-gray-50" size={20} onClick={() => setShouldShowConfirmDeleteModal(true)} />
                                    <PencilSquare className="mr-5 mt-2 cursor-pointer float-right text-gray-200 hover:text-gray-50" size={20} onClick={() => setShouldShowEditModal(true)} />
                                </span>
                                : undefined
                        }
                        <div>
                            <Link href={`/learn/${lp.id}`}>
                                <div className="text-5xl pb-5 font-semibold tracking-tight text-gray-50 cursor-pointer">{learningPath.title}</div>
                            </Link>
                        </div>
                        <div className="flex flex-wrap md:x-1 text-md text-gray-100">
                            {
                                db.user ?
                                    lp.userData.isFavorite ?
                                        <span className="flex">
                                            <span className="flex px-1 md:pr-3 align-middle cursor-pointer" onClick={() => setLpFavorite(false)}>
                                                <HeartFill className="px-1 text-red-600" size={26} />
                                                <span>
                                                    {lp.data.countFavorite}
                                                </span>
                                            </span>
                                        </span>
                                        :
                                        <span className="flex">
                                            <span className="flex px-1 md:pr-3 align-middle cursor-pointer" onClick={() => setLpFavorite(true)}>
                                                <Heart className="px-1 text-red-600" size={26} />
                                                <span>
                                                    {lp.data.countFavorite}
                                                </span>
                                            </span>
                                        </span>
                                    :
                                    <Link href="/login">
                                        <span className="flex">
                                            <span className="flex px-1 md:pr-3 align-middle cursor-pointer">
                                                <Heart className="px-1 text-red-600" size={26} />
                                                <span>
                                                    {lp.data.countFavorite}
                                                </span>
                                            </span>
                                        </span>
                                    </Link>
                            }
                            <span className="flex pr-1 md:pr-3">
                                <StarRating
                                    size={18}
                                    numStars={Math.round(lp.data.avgRating)}
                                    isClickable={lp.userData.progress === 1.0}
                                    cb={(numStars: number) => { setLpRating(numStars) }}
                                />
                                <span className="pl-1">{Math.round(lp.data.avgRating * 10) / 10}</span>
                                <span className="pl-1">({lp.data.countReviews} rating{lp.data.countReviews === 1 ? '' : 's'})</span>
                            </span>
                            {renderInfoChip(lp.data.difficulty, getChipColor('DIFFICULTY', lp.data.difficulty))}
                            {renderInfoChip(lp.data.duration, getChipColor('EST_DURATION', lp.data.duration))}
                        </div>
                        {renderLpSummaryDetail({ lp, progress: lp.userData.progress })}
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