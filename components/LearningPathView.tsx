import { CheckSquareFill, Check } from 'react-bootstrap-icons';
import { useState } from 'react';
import LearningPathSummary from './LearningPathSummary';

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
            <div className="rounded p-1 mt-1 flex w-28 text-gray-700 bg-gray-100 hover:bg-gray-200" onClick={() => setIsComplete(true)}>
              <div className="mx-auto flex">
                <span className="text-sm">Complete</span>
                <Check className="ml-2 text-gray-500" size={20} />
              </div>
            </div> :
            <div className="rounded p-1 mt-1 flex w-28 text-green-700 bg-green-100 hover:bg-green-200" onClick={() => setIsComplete(false)}>
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

function renderConcepts(concepts, completedContentIds) {
  return concepts.map((concept, iConcept) => {
    return (
      <div className="bg-white px-5 pt-5 items-center text-gray-700" key={`${concept.id}-concept`}>
        <div className="text-2xl pb-1 font-semibold text-gray-800">{`${iConcept + 1}. ${concept.name}`}</div>
        <div>
          {
            concept.contents.map((content, iContent) => {
              const isUserFavorite = completedContentIds.some(c => c === content.id)
              return (
                <div key={`${content.id}-content`}>
                  { renderContent(content, `${iConcept + 1}.${iContent + 1}.`, isUserFavorite)}
                </div>
              )
            })
          }
        </div>
      </div>
    )
  })
}

export default function LearningPathView({
  userLp,
}) {
  // TODO: factor out commonly used components
  // TODO: make stars configurable

  return (
    <div>
      <div className="relative bg-white overflow-hidden">
        <div className="mx-auto p-6 max-w-4xl">
          <LearningPathSummary
            userLp={userLp}
            isCompact={false}
          />
          {renderConcepts(userLp.data.data.concepts, userLp.completedContentIds)}
        </div>
      </div>
    </div>
  )
}