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
            {
                lp.userData.isCreator === true ?
                    <Trash className="cursor-pointer" size={24} onClick={() => db.deleteLearningPath(lp.id)} />
                    : undefined
            }
        </div>
    )
}

const renderStarRating = (numStars: number, cb: any) => {
    const stars = []
    for (let i = 1; i <= 5; i++) { // note: starts at index 1
        console.log(i)
        stars.push(
            i <= numStars ?
            <StarFill id={`${i}-key`} onClick={() => cb(i)} className="text-yellow-300 hover:bg-gray-200 mt-0.5" size={18} />
            :
            <Star id={`${i}-key`} onClick={() => cb(i)} className="text-yellow-300 hover:bg-gray-200 mt-0.5" size={18} />
        )
    }

    return (
        <div className="flex">
            {stars}
        </div>
    )

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

    return (
        <div className="bg-gray-100 rounded-xl p-3 md:p-5 items-center text-gray-700">
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
                    {renderStarRating(lp.data.avgRating, (numStars) => { console.log('clicked stars', numStars) })}
                    <span className="pl-1">{lp.data.countReviews}</span>
                </span>
                <span className="text-xs p-1 ml-1 md:ml-2 rounded-lg bg-green-100 text-green-700 font-light capitalize">
                    {lp.data.difficulty.toLowerCase()}
                </span>
                <span className="text-xs p-1 ml-1 md:ml-2 rounded-lg bg-yellow-100 text-yellow-700 font-light capitalize">
                    {lp.data.estDurationBucket.toLowerCase()}
                </span>
            </div>
            { !isCompact ?
                renderLpSummaryDetail({ lp, userProgress, isFavorite: lp.userData.isFavorite }) :
                <div className="text-sm pt-2 text-gray-500">{learningPath.author.name} {lp.userData.isCreator === true ? '(You)' : undefined}</div>
            }
        </div>
    )
}