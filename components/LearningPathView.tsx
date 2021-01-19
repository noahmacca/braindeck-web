import { HeartFill, Heart, CheckSquareFill, Check, Star, StarFill } from 'react-bootstrap-icons';
import { useState } from 'react';
import Link from 'next/link';

function processUserLpData(userLpData, lp) {
  let isUserFavorite = false;
  let isUserComplete = false;
  for (let i = 0; i < userLpData.length; i++) {
    if (userLpData[i].id === parseInt(lp.id)) {
      if (userLpData[i].favorite) isUserFavorite = true;
      if (userLpData[i].complete) isUserComplete = true
    }
  }
  return [isUserFavorite, isUserComplete]
}

function hasUserCompletedContent(userContentData, content) {
  let isUserFavorite = false;
  for (let i = 0; i < userContentData.length; i++) {
    if (userContentData[i].id === content.id && userContentData[i].complete) {
      isUserFavorite = true;
    }
  }
  return isUserFavorite
}

function renderContent(content, idx, isUserFavorite) {
  const [isComplete, setIsComplete] = useState(isUserFavorite);
  return (
    <div className="p-3 mx-3 bg-gray-50 mb-3 rounded-lg">
      <div className="text-xl mb-1">
        {`${idx} `}<a href={`${content.url}`}>{`${content.title}`}</a>
      </div>
      <div className="text-sm mb-2">
        {content.author}{' '}
        <span className="capitalize text-xs p-1 ml-1 rounded-lg bg-indigo-100 text-indigo-700 font-light">
          {content.format.toLowerCase()}
        </span>{' '} 
        {
          content.difficulty === "EASY" ?
          <span className="capitalize text-xs p-1 ml-1 rounded-lg bg-green-100 text-green-700 font-light">
            {content.difficulty.toLowerCase()}
          </span> :
          <span className="capitalize text-xs p-1 ml-1 rounded-lg bg-yellow-100 text-yellow-700 font-light">
            {content.difficulty.toLowerCase()}
          </span>
        }
      </div>
      <div className="pb-2">
        { content.takeaway && <div className="text-sm font-medium">Takeaway <span className="font-light">{content.takeaway}</span></div> }
        { content.highlight && <div className="text-sm font-medium">Highlight <span className="font-light">{content.highlight}</span></div> }
      </div>
      <div>
        {
          !isComplete ?
            <div className="border border-gray-700 rounded p-1 mt-1 flex w-28 text-gray-700 bg-gray-50 hover:bg-gray-100" onClick={() => setIsComplete(true)}>
              <div className="mx-auto flex">
                <span className="text-sm">Complete</span>
                <Check className="ml-2 text-gray-500" size={20} />
              </div>
            </div> :
            <div className="border border-green-700 rounded p-1 mt-1 flex w-28 text-green-700 bg-green-50 hover:bg-green-100" onClick={() => setIsComplete(false)}>
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

function renderConcepts(concepts, userContents) {
  return concepts.map((concept, iConcept) => {
    return (
      <div className="bg-white p-5 items-center text-gray-700" key={`${concept.id}-concept`}>
        <div className="text-2xl pb-1 font-semibold text-gray-800">{`${iConcept + 1}. ${concept.name}`}</div>
        <div>
          {
            concept.contents.map((content, iContent) => {
              let isUserFavorite = hasUserCompletedContent(userContents, content);
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
  learningPath,
  userData
}) {
  const [isUserFavorite, isUserComplete] = processUserLpData(userData.lps, learningPath)
  const [lpHasFavorite, setLpHasFavorite] = useState(isUserFavorite);
  // TODO: factor out commonly used components
  // TODO: make stars configurable

  return (
    <div>
      {/* stack boxes */}
      <div className="relative bg-white overflow-hidden">
        <div className="mx-auto px-6 max-w-4xl">
          {/* Learning Path Summary */}
          <div className="border bg-indigo-50 rounded p-5 items-center text-gray-700">
            <div className="text-sm text-gray-500">{learningPath.subject}</div>
            <div className="text-4xl pb-1 font-bold tracking-tight text-gray-800">{learningPath.title}</div>
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
                <div className="text-sm font-medium">Last Updated <span className="font-light">Jan 2021</span></div>
                <div className="text-sm font-medium">Your Progress <span className="font-light">90% complete</span></div>
              </div>
            </div>
            {
              !lpHasFavorite ?
                <div className="border border-gray-700 rounded p-1.5 flex w-36 text-gray-700 bg-gray-50 hover:bg-gray-100" onClick={() => setLpHasFavorite(true)}>
                  <div className="mx-auto flex">
                    <span className="text-md">Favorite</span>
                    <Heart className="ml-2 text-red-700 mt-1" size={20} />
                  </div>
                </div> :
                <div className="border border-red-700 rounded p-1.5 flex w-36 text-red-700 bg-red-50 hover:bg-red-100" onClick={() => setLpHasFavorite(false)}>
                  <div className="mx-auto flex">
                    <span className="text-md">Favorited</span>
                    <HeartFill className="ml-2 text-red-500 mt-1" size={20} />
                  </div>
                </div>
            }
          </div>
          {/* Concepts in learning path */}
          {renderConcepts(learningPath.concepts, userData.contents)}
        </div>
      </div>
    </div>
  )
}