
function renderConcept(lpContents, iParent) {
    return lpContents.map((content, i) => {
        return (
            <div className="container p-3">
                <div key={`${content.id}`}>
                    <a href={`${content.url}`}>
                        <h5>{`${iParent+1}.${i+1}. ${content.title}`}</h5>
                    </a>
                    <div>{content.author}</div>
                    <div>{content.takeaway}</div>
                    <div>{content.format} {content.difficulty} {content.highlight}</div>
                </div>
            </div>
        )
    })
}

function renderConcepts(concepts) {
    return concepts.map((concept, i) => {
        return (
            <div key={`${concept.id}`} className="container m-3">
                <h2>{`${i+1}. ${concept.name}`}</h2>
                { renderConcept(concept.contents, i) }
            </div>
        )
    })
}

export default function LearningPathView({ learningPath }) {
    const lpData = learningPath.data;
    return (
        <div>
            <div className="container mt-5">
                <div className="row">
                    <h1>{lpData.title}</h1>
                    <div>Created By: {lpData.author.name}</div>
                    <div>Background: {lpData.background}</div>
                    <div>Difficulty: {lpData.difficulty}</div>
                    <div>Estimated Time (hr): {lpData.approxDurationHr}</div>
                    { renderConcepts(lpData.concepts) }
                </div>
            </div>
        </div>
    )
}