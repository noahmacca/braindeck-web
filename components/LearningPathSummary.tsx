import { HeartFill, Heart, CheckSquareFill, Check, Star, StarFill } from 'react-bootstrap-icons';
import { useState } from 'react';
import Link from 'next/link';

function processUserLpData(userLpData, lp) {
    let isUserFavorite = false;
    let isUserComplete = false;
    let userProgress = 0.0;
    for (let i = 0; i < userLpData.length; i++) {
        if (userLpData[i].id === parseInt(lp.id)) {
            if (userLpData[i].favorite) isUserFavorite = true;
            if (userLpData[i].complete) isUserComplete = true;
            userProgress = userLpData[i].progress;
        }
    }
    return [isUserFavorite, isUserComplete, userProgress]
}

export default function LearningPathSummary({ learningPath, userData, shouldLinkToDetailPage }) {
    const [isUserFavorite, isUserComplete, userProgress] = processUserLpData(userData.lps, learningPath)
    const [lpHasFavorite, setLpHasFavorite] = useState(isUserFavorite);

    return (
        <div className="border bg-indigo-50 rounded p-5 items-center text-gray-700">
            <div className="text-sm text-gray-500">{learningPath.subject}</div>
            {
                shouldLinkToDetailPage ?
                    <Link href={`/learn/${learningPath.id}`}>
                        <div className="text-3xl pb-1 font-semibold tracking-tight text-blue-700 cursor-pointer">{learningPath.title}</div>
                    </Link>
                    : <div className="text-3xl pb-1 font-semibold tracking-tight text-gray-800">{learningPath.title}</div>
            }
            <div className="flex px-1 text-md font-light text-gray-500">
                <span className="flex pr-3">
                    <HeartFill className="px-1 text-red-500" size={24} />{parseInt(learningPath.countFavorite) + (lpHasFavorite ? 1 : 0)}
                </span>
                <span className="flex pr-3">
                    <StarFill className="text-yellow-300 mt-0.5" size={18} />
                    <StarFill className="text-yellow-300 mt-0.5" size={18} />
                    <StarFill className="text-yellow-300 mt-0.5" size={18} />
                    <StarFill className="text-yellow-300 mt-0.5" size={18} />
                    <Star className="text-yellow-300 mt-0.5" size={18} />
                    <span className="pl-1">{learningPath.numReviews}</span>
                </span>
                <span className="text-xs p-1 ml-2 rounded-lg bg-green-100 text-green-700 font-light capitalize">
                    {learningPath.difficulty.toLowerCase()}
                </span>
                <span className="text-xs p-1 ml-2 rounded-lg bg-yellow-100 text-yellow-700 font-light capitalize">
                    {learningPath.estDurationBucket.toLowerCase()}
                </span>
            </div>
            <div className="px-2 py-3">
                <div className="pb-3">
                    <div className="text-sm font-medium">Learning Goal</div>
                    <div className="text-md font-light">{learningPath.learningGoal}</div>
                </div>
                <div className="pb-3">
                    <div className="text-sm font-medium">Background Knowledge</div>
                    <div className="text-md font-light">{learningPath.background}</div>
                </div>
                <div className="pb-3">
                    <div className="text-sm font-medium">Created by <span className="font-light">{learningPath.author.name}</span></div>
                    <div className="text-sm font-medium">Last Updated <span className="font-light">{learningPath.updated}</span></div>
                    <div className="text-sm font-medium">Your Progress <span className="font-light">{Number(userProgress) * 100}%</span></div>
                </div>
            </div>
            {
                !lpHasFavorite ?
                    <div className="border border-gray-400 rounded p-1.5 flex w-36 text-gray-700 bg-gray-50 hover:bg-gray-100" onClick={() => setLpHasFavorite(true)}>
                        <div className="mx-auto flex">
                            <span className="text-md">Favorite</span>
                            <Heart className="ml-2 text-red-700 mt-1" size={20} />
                        </div>
                    </div> :
                    <div className="border border-red-400 rounded p-1.5 flex w-36 text-red-700 bg-red-50 hover:bg-red-100" onClick={() => setLpHasFavorite(false)}>
                        <div className="mx-auto flex">
                            <span className="text-md">Favorited</span>
                            <HeartFill className="ml-2 text-red-500 mt-1" size={20} />
                        </div>
                    </div>
            }
        </div>
    )
}