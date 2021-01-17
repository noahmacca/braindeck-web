
export default function LearningPathView({ learningPath }) {
    return (
        <div>
            <div className="alert alert-primary text-center">
                New Learning Path Coming Soon
            </div>
            <div>
                { JSON.stringify(learningPath) }
            </div>
        </div>
    )
}