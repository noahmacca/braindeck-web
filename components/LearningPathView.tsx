import { HeartFill, Heart, CheckSquareFill, CheckSquare, Star, StarFill } from 'react-bootstrap-icons';
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
  const [isChecked, setIsChecked] = useState(isUserFavorite);
  return (
    <div>
      <h5>
        {
          isChecked === true ?
            <CheckSquareFill onClick={() => setIsChecked(false)} color="green" /> :
            <CheckSquare onClick={() => setIsChecked(true)} />
        }
        {` ${idx} `}<a href={`${content.url}`}>{`${content.title}`}</a>
      </h5>
      <div>By {content.author}</div>
      {content.takeaway &&
        <div>{content.takeaway}</div>
      }
      {content.highlight &&
        <div><span>Highlight:</span> {content.highlight}</div>
      }
      <div><span>Format:</span> {content.format}</div>
      <div><span>Difficulty:</span> {content.difficulty}</div>

    </div>
  )
}

function renderConcepts(concepts, userContents) {
  return concepts.map((concept, iConcept) => {
    return (
      <div key={`${concept.id}-concept`}>
        <h4>{`${iConcept + 1}. ${concept.name}`}</h4>
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
    )
  })
}

export default function LearningPathView({
  learningPath,
  userData
}) {
  const [isUserFavorite, isUserComplete] = processUserLpData(userData.lps, learningPath)
  const [lpHasFavorite, setLpHasFavorite] = useState(isUserFavorite);

  return (
    <div>
      {/* stack boxes */}
      <div className="relative bg-white overflow-hidden">
        <div className="mx-auto px-6 max-w-4xl mt-10">
          <div className="border bg-gray-50 rounded p-5 items-center text-gray-700">
            <div className="text-sm text-gray-500">Machine Learning</div>
            <div className="text-4xl pb-1 font-bold tracking-tight text-gray-800">{learningPath.title}</div>
            <div className="flex text-md font-light text-gray-500">
              <span className="flex pr-3">
                <HeartFill className="px-1 text-red-500" size={24} />{parseInt(learningPath.countFavorite) + (lpHasFavorite ? 1 : 0)}
              </span>
              <span className="flex pr-3">
                <StarFill className="text-yellow-300 mt-0.5" size={18} />
                <StarFill className="text-yellow-300 mt-0.5" size={18} />
                <StarFill className="text-yellow-300 mt-0.5" size={18} />
                <StarFill className="text-yellow-300 mt-0.5" size={18} />
                <Star className="text-yellow-300 mt-0.5" size={18} />
                <span className="pl-1">150</span>
              </span>
              <span className="border text-xs p-1 mx-1 rounded-lg bg-green-50 border-green-700 text-green-700 font-light">
                {learningPath.difficulty}
              </span>
              <span className="border text-xs p-1 mx-1 rounded-lg bg-yellow-50 border-yellow-700 text-yellow-700 font-light">
                {learningPath.approxDurationHr} Hr
              </span>
            </div>
            <div className="px-5 py-3">
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
                <div className="border border-indigo-700 rounded p-1.5 flex w-36 text-indigo-700 bg-indigo-50 hover:bg-indigo-100" onClick={() => setLpHasFavorite(true)}>
                  <div className="mx-auto flex">
                    <span className="text-md">Favorite</span>
                    <Heart className="ml-2 text-red-700 mt-1" size={20} />
                  </div>
                </div> :
                <div className="border border-indigo-700 rounded p-1.5 flex w-36 text-indigo-700 bg-indigo-50 hover:bg-indigo-100" onClick={() => setLpHasFavorite(false)}>
                  <div className="mx-auto flex">
                    <span className="text-md">Favorited</span>
                    <HeartFill className="ml-2 text-red-500 mt-1" size={20} />
                  </div>
                </div>
            }
          </div>
        </div>
      </div>
      <div className="mt-20">
        {renderConcepts(learningPath.concepts, userData.contents)}
      </div>
    </div>
  )
}