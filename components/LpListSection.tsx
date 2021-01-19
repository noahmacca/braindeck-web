import LearningPathSummary from './LearningPathSummary';

export default function LpListSection({ title, lps, userData }) {
    const learningPath = lps[0].data
    return (
        <div className="container my-5">
            <div className="text-4xl pb-1 font-bold tracking-tight text-gray-800">{title}</div>
            {lps.map((lp) => (
                <div key={lp.id} className="m-2">
                    <LearningPathSummary
                        learningPath={lp.data}
                        userData={userData}
                    />
                </div>
            ))}
        </div>
    )
}