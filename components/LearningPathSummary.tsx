import Link from 'next/link'
import { HeartFill, Heart, Star, StarFill, Trash, PencilSquare } from 'react-bootstrap-icons';
import { useState } from 'react';
import { LearningPathUser } from '../hooks/types';
import { useDb } from '../hooks/useDb';
import LearningPathForm from './forms/LearningPathForm';
import FormModal from '../components/forms/FormModal';

const renderLpSummaryDetail = ({ lp, progress }:
    {
        lp: LearningPathUser,
        progress: number
    }) => {

    return (
        <div>
            <div className="px-2 py-3">
                <div className="pb-3">
                    <div className="text-sm font-medium">Learning Goal</div>
                    <div className="text-md font-light">{lp.data.learningGoal}</div>
                </div>
                <div className="pb-3">
                    <div className="text-sm font-medium">Background Knowledge</div>
                    <div className="text-md font-light">{lp.data.background}</div>
                </div>
                <div>
                    <div className="text-sm font-medium">Created by <span className="font-light">{lp.data.author.name} {lp.userData.isCreator === true ? '(You)' : undefined}</span></div>
                    <div className="text-sm font-medium">Last Updated <span className="font-light">{new Date(lp.data.updated).toLocaleDateString()}</span></div>
                    <div className="text-sm font-medium">Your Progress <span className="font-light">{Math.round(progress * 100)}%</span></div>
                </div>
            </div>
        </div>
    )
}

const renderStarRating = (numStars: number, cb: any) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
        stars.push(
            i <= numStars ?
                <StarFill key={`${i}-key`} onClick={() => cb(i)} className="text-yellow-300 hover:bg-gray-200 mt-0.5" size={18} />
                :
                <Star key={`${i}-key`} onClick={() => cb(i)} className="text-yellow-300 hover:bg-gray-200 mt-0.5" size={18} />
        )
    }

    return (
        <div className="flex">
            {stars}
        </div>
    )

}

const renderInfoChip = (text: string, color: string) => {
    return (
        <span className={`text-xs p-1 px-2 ml-1 md:ml-2 rounded-lg bg-${color}-600 text-white capitalize`}>
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
            'MODERATE': 'indigo',
            'HARD': 'yellow',
            'ADVANCED': 'orange'
        },
        'EST_DURATION': {
            'FAST (<1 HR)': 'green',
            'QUICK (<1 HR)': 'green',
            'FAST (1-2 HR)': 'indigo',
            'MEDIUM (2-5 HR)': 'yellow',
            'LONG (5-10 HR)': 'orange',
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



export default function LearningPathSummary({ lp, isCompact }: { lp: LearningPathUser, isCompact: boolean }) {
    const [shouldShowEditModal, setShouldShowEditModal] = useState(false);
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
        <div className="bg-gray-100 rounded-xl p-3 md:p-5 items-center text-gray-700">
            {
                lp.userData.isCreator === true ?
                    <span>
                        <Trash className="mr-7 mt-2 cursor-pointer float-right text-gray-400" size={20} onClick={() => db.deleteLearningPath(lp.id)} />
                        <PencilSquare className="mr-5 mt-2 cursor-pointer float-right text-gray-400" size={20} onClick={() => setShouldShowEditModal(true)} />
                    </span>
                    : undefined
            }
            {
                isCompact ?
                    <div>
                        <Link href={`/learn/${lp.id}`}>
                            <div className="text-xl pb-1 tracking-tight text-gray-700 cursor-pointer">{lp.data.title}</div>
                        </Link>
                    </div>
                    :
                    <div>
                        <div className="text-sm text-gray-500">{lp.data.subject}</div>
                        <Link href={`/learn/${lp.id}`}>
                            <div className="text-3xl pb-1 font-semibold tracking-tight text-gray-800 cursor-pointer">{learningPath.title}</div>
                        </Link>
                    </div>
            }
            <div className="flex flex-wrap md:x-1 text-md font-light text-gray-500">
                {
                    lp.userData.isFavorite ?
                        <span className="flex pr-1 md:pr-3">
                            <HeartFill className="px-1 text-red-500 cursor-pointer" size={24} onClick={() => setLpFavorite(false)} />{lp.data.countFavorite}
                        </span> :
                        <span className="flex pr-1 md:pr-3">
                            <Heart className="px-1 text-red-500 cursor-pointer" size={24} onClick={() => setLpFavorite(true)} />{lp.data.countFavorite}
                        </span>
                }
                <span className="flex pr-1 md:pr-3">
                    {renderStarRating(Math.round(lp.data.avgRating), (numStars) => { setLpRating(numStars) })}
                    <span className="pl-1">{Math.round(lp.data.avgRating * 10) / 10}</span>
                    <span className="pl-1">({lp.data.countReviews} review{lp.data.countReviews === 1 ? '' : 's'})</span>
                </span>
                {renderInfoChip(lp.data.difficulty, getChipColor('DIFFICULTY', lp.data.difficulty))}
                {renderInfoChip(lp.data.duration, getChipColor('EST_DURATION', lp.data.duration))}
            </div>
            { !isCompact ?
                renderLpSummaryDetail({ lp, progress: lp.userData.progress }) :
                <div className="text-sm pt-2 text-gray-500">{learningPath.author.name} {lp.userData.isCreator === true ? '(You)' : undefined}</div>
            }
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
        </div>
    )
}