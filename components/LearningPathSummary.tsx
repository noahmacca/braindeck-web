import { Console } from 'console';
import { HeartFill, Heart, Star, StarFill, Trash } from 'react-bootstrap-icons';
import { LearningPathUser } from '../hooks/types';
import { useDb } from '../hooks/useDb';

const renderLpSummaryDetail = ({ lp, userProgress, isFavorite }:
    {
        lp: LearningPathUser,
        userProgress: number,
        isFavorite: boolean
    }) => {
    const db = useDb();

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
                <div className="pb-3">
                    <div className="text-sm font-medium">Created by <span className="font-light">{lp.data.author.name} {lp.userData.isCreator === true ? '(You)' : undefined}</span></div>
                    <div className="text-sm font-medium">Last Updated <span className="font-light">{new Date(lp.data.updated).toLocaleDateString()}</span></div>
                    <div className="text-sm font-medium">Your Progress <span className="font-light">{Math.round(userProgress * 100)}%</span></div>
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
        <span className={`text-s p-1 px-2 ml-1 md:ml-2 rounded-lg bg-${color}-100 text-gray-700 font-light capitalize`}>
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
    const learningPath = lp.data;
    const userProgress = lp.userData && lp.userData.completedContentIds.length / lp.userData.numLearningResourcesTotal;
    const db = useDb();
    const setLpFavorite = (isFavorite: boolean) => db.setLpFavorite({
        isFavorite,
        lpId: lp.id,
        uId: db.user.uid,
    })

    const setUserRating = (rating: number) => db.setUserRating({
        rating,
        lpId: lp.id,
        uId: db.user.uid
    });

    return (
        <div className="bg-gray-100 rounded-xl p-3 md:p-5 items-center text-gray-700">
            {
                lp.userData.isCreator === true ?
                    <Trash className="mx-5 cursor-pointer float-right text-gray-400" size={20} onClick={() => db.deleteLearningPath(lp.id)} />
                    : undefined
            }
            {
                isCompact ?
                    <div>
                        <div className="text-xl pb-1 tracking-tight text-gray-700">{lp.data.title}</div>
                    </div>
                    :
                    <div>
                        <div className="text-sm text-gray-500">{lp.data.subject}</div>
                        <div className="text-3xl pb-1 font-semibold tracking-tight text-gray-800">{learningPath.title}</div>
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
                    {renderStarRating(Math.round(lp.data.avgRating), (numStars) => { setUserRating(numStars) })}
                    <span className="pl-1">{Math.round(lp.data.avgRating * 10) / 10}</span>
                    <span className="pl-1">({lp.data.countReviews} review{lp.data.countReviews === 1 ? '' : 's'})</span>
                </span>
                {renderInfoChip(lp.data.difficulty, getChipColor('DIFFICULTY', lp.data.difficulty))}
                {renderInfoChip(lp.data.estDurationBucket, getChipColor('EST_DURATION', lp.data.estDurationBucket))}
            </div>
            { !isCompact ?
                renderLpSummaryDetail({ lp, userProgress, isFavorite: lp.userData.isFavorite }) :
                <div className="text-sm pt-2 text-gray-500">{learningPath.author.name} {lp.userData.isCreator === true ? '(You)' : undefined}</div>
            }
        </div>
    )
}