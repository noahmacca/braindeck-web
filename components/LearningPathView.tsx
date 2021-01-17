
export default function LearningPathView({ learningPath }) {
    return (
        <div>
            <div className="container mt-5">
                <div className="row">
                    <h2>{learningPath.data.title}</h2>
                    <div>Created By: {learningPath.data.author.name}</div>
                    <div>Background: {learningPath.data.background}</div>
                    <div>Difficulty: {learningPath.data.difficulty}</div>
                    <div>Estimated Time (hr): {learningPath.data.approxDurationHr}</div>
                </div>
            </div>
        </div>
    )
}