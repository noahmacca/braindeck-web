import { CheckSquareFill, Check } from 'react-bootstrap-icons';
import { useState } from 'react';
import LearningPathSummary from './LearningPathSummary';
import { useDb } from '../hooks/useDb';
import { LearningPathUser, LearningConcept } from '../hooks/types';

function renderContent(content, idx, isUserFavorite) {
    const [isComplete, setIsComplete] = useState(isUserFavorite);
    return (
        <div className="p-3 mx-3 bg-gray-50 mb-3 rounded-lg">
            <div className="text-xl mb-1">
                {`${idx} `}<a href={`${content.url}`}>{`${content.title}`}</a>
            </div>
            <div className="text-sm mb-4">
                {content.author}{' '}
                <span className="capitalize ml-2 text-xs p-1 rounded-lg bg-indigo-100 text-indigo-700 font-light">
                    {content.format.toLowerCase()}
                </span>{' '}
                {
                    content.difficulty === "EASY" ?
                        <span className="capitalize text-xs p-1 ml-2 rounded-lg bg-green-100 text-green-700 font-light">
                            {content.difficulty.toLowerCase()}
                        </span> :
                        <span className="capitalize text-xs p-1 ml-2 rounded-lg bg-yellow-100 text-yellow-700 font-light">
                            {content.difficulty.toLowerCase()}
                        </span>
                }
            </div>
            <div className="pb-2">
                {content.takeaway && <div className="text-sm font-medium">Takeaway <span className="font-light">{content.takeaway}</span></div>}
                {content.highlight && <div className="text-sm font-medium">Highlight <span className="font-light">{content.highlight}</span></div>}
            </div>
            <div>
                {
                    !isComplete ?
                        <div className="rounded p-1 mt-1 flex w-28 text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-pointer" onClick={() => setIsComplete(true)}>
                            <div className="mx-auto flex">
                                <span className="text-sm">Complete</span>
                                <Check className="ml-2 text-gray-500" size={20} />
                            </div>
                        </div> :
                        <div className="rounded p-1 mt-1 flex w-28 text-green-700 bg-green-100 hover:bg-green-200 cursor-pointer" onClick={() => setIsComplete(false)}>
                            <div className="mx-auto flex">
                                <span className="text-sm">Completed</span>
                                <CheckSquareFill className="ml-2 text-green-500" size={20} />
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

function renderLearningConcepts(learningConcepts: Array<LearningConcept>) {
    const db = useDb();
    return learningConcepts.map((learningConcept, idxConcept) => {
        return (
            <div className="bg-white px-5 pt-5 items-center text-gray-700" key={`${learningConcept.id}-concept`}>
                <div className="text-2xl pb-1 font-semibold text-gray-800">{`${idxConcept + 1}. ${learningConcept.title}`}</div>
                <div>
                    {
                        learningConcept.learningResources.map((learningResource, idxResource) => {
                            const isUserFavorite = db.user.learningResources.some(uLr => (uLr.id === learningResource.id) && !!uLr.isCompleted)
                            return (
                                <div key={`${learningResource.id}-content`}>
                                    { renderContent(learningResource, `${idxConcept + 1}.${idxResource + 1}.`, isUserFavorite)}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    })
}

export default function LearningPathView({ lpId }: { lpId: string }) {
    const db = useDb();
    const lp: LearningPathUser = db.userLearningPaths.filter((uLp) => uLp.id === lpId)[0]
    const userLearningResources = db.user.learningResources;
    console.log('LearningPathView, lp', lp);
    console.log('LearningPathView, user', db.user);
    return (
        <div>
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto p-6 max-w-4xl">
                    <LearningPathSummary
                        lp={lp}
                        isCompact={false}
                    />
                    {renderLearningConcepts(lp.data.learningConcepts)}
                </div>
            </div>
        </div>
    )
}