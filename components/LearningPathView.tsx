import { HeartFill, Heart, CheckSquareFill, CheckSquare } from 'react-bootstrap-icons';
import { useState } from 'react';

function renderContents(contents, iParent) {
    const [isChecked, setIsChecked] = useState(false);

    return contents.map((content, i) => {
        return (
            <div key={`${content.id}-content`} className="container p-3">
                <div>

                    <h5>
                        {
                            content.complete && content.complete === "True" ?
                                <CheckSquareFill color="green" /> :
                                <CheckSquare onClick={() => setIsChecked(true)}/>
                        }
                        {` ${iParent + 1}.${i + 1}. `}<a href={`${content.url}`}>{`${content.title}`}</a>
                    </h5>
                    <div>By {content.author}</div>
                    {content.takeaway &&
                        <div className="fst-italic">{content.takeaway}</div>
                    }
                    {content.highlight &&
                        <div><span className="fw-bold">Highlight:</span> {content.highlight}</div>
                    }
                    <div><span className="fw-bold">Format:</span> {content.format}</div>
                    <div><span className="fw-bold">Difficulty:</span> {content.difficulty}</div>

                </div>
            </div>
        )
    })
}

function renderConcepts(concepts) {
    return concepts.map((concept, i) => {
        return (
            <div key={`${concept.id}-concept`} className="container m-3">
                <h2>{`${i + 1}. ${concept.name}`}</h2>
                { renderContents(concept.contents, i)}
            </div>
        )
    })
}

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

export default function LearningPathView({
    learningPath,
    userData
}) {
    const [isUserFavorite, isUserComplete] = processUserLpData(userData.lps, learningPath)
    const [lpHasFavorite, setLpHasFavorite] = useState(false);

    return (
        <div>
            <div className="container m-5">
                <div className="row">
                    <h1>{learningPath.title}</h1>
                    <h5 className="fw-light">
                        {
                            isUserFavorite || lpHasFavorite ?
                                <HeartFill color="red" onClick={() => setLpHasFavorite(false)} /> :
                                <Heart color="red" onClick={() => setLpHasFavorite(true)} />
                        }{learningPath.countFavorite} {'   '}
                        {
                            isUserComplete ?
                                <CheckSquareFill color="green" /> :
                                <CheckSquareFill />
                        }{learningPath.countComplete}
                    </h5>
                    {/* <div><span className="fw-bold">Created By:</span> {learningPath.author.name}</div> */}
                    <div><span className="fw-bold">Learning Goal:</span> {learningPath.learningGoal}</div>
                    <div><span className="fw-bold">Background:</span> {learningPath.background}</div>
                    <div><span className="fw-bold">Overall Difficulty:</span> {learningPath.difficulty}</div>
                    <div><span className="fw-bold">Estimated Time:</span> {learningPath.approxDurationHr} hr</div>
                    {renderConcepts(learningPath.concepts)}
                </div>
            </div>
        </div>
    )
}