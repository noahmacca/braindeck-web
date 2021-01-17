
function renderContents(contents, iParent) {
    return contents.map((content, i) => {
        return (
            <div key={`${content.id}-content`} className="container p-3">
                <div>
                    <a href={`${content.url}`}>
                        <h5>{`${iParent + 1}.${i + 1}. ${content.title}`}</h5>
                    </a>
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

export default function LearningPathView({ learningPath }) {
    const lpData = learningPath.data;
    return (
        <div>
            <div className="container m-5">
                <div className="row">
                    <h1>{lpData.title}</h1>
                    <div><span className="fw-bold">Created By:</span> {lpData.author.name}</div>
                    <div><span className="fw-bold">Learning Goal:</span> {lpData.learningGoal}</div>
                    <div><span className="fw-bold">Background:</span> {lpData.background}</div>
                    <div><span className="fw-bold">Overall Difficulty:</span> {lpData.difficulty}</div>
                    <div><span className="fw-bold">Estimated Time:</span> {lpData.approxDurationHr} hr</div>
                    {renderConcepts(lpData.concepts)}
                </div>
            </div>
        </div>
    )
}