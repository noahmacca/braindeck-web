import { LearningPathUser } from '../hooks/types';
import { useDb } from '../hooks/useDb';
import { useState } from 'react';
import StarRating from './StarRating';

const CourseCompletePanel = ({ lp }: { lp: LearningPathUser }) => {
    const defaultCopyButtonText = "Copy Link "
    const [copyButtonText, setCopyButtonText] = useState(defaultCopyButtonText);
    const userRating = lp.userData.rating;

    const db = useDb();
    const setLpRating = (rating: number) => db.setLpRating({
        rating,
        lpId: lp.id,
        uId: db.user.uid
    });

    const copyUrlToClipboard = () => {
        const dummy = document.createElement('input');
        const text = window.location.href;

        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        setCopyButtonText('Copied 🚀')
        setTimeout(() => {
            setCopyButtonText(defaultCopyButtonText)
        }, 2000);
    }

    return (
        <div>
            {
                lp.userData.progress !== 1.0 ?
                    null
                    :
                    <div className="bg-gray-100 px-4 pt-3 pb-1 rounded-lg md:mx-4 my-2 items-center text-gray-700">
                        <div className="mb-2">
                            <div className="text-2xl pb-1 font-medium text-gray-800">Congratulations!</div>
                            <div className="text-md pb-1 font-light text-gray-600">You have finished this course.</div>
                        </div>
                        <div className="p-3 md:mx-3 bg-white mb-2 rounded-lg">
                            <div className="text-xl mb-2">
                                Your rating
                        </div>
                            <StarRating
                                size={32}
                                numStars={userRating}
                                isClickable={lp.userData.progress === 1.0}
                                cb={(numStars: number) => { setLpRating(numStars) }}
                            />
                        </div>
                        <div className="p-3 md:mx-3 bg-white mb-2 rounded-lg">
                            <div className="text-xl mb-2">
                                Share
                            </div>
                            <div
                                className="w-44 rounded-md text-center font-gray-800 py-2 mt-2 text-md font-medium text-md text-gray-50 bg-green-600 hover:bg-green-500 cursor-pointer"
                                onClick={() => copyUrlToClipboard()}
                            >
                                {copyButtonText}
                    </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default CourseCompletePanel