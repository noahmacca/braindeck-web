import LearningPathSummary from './LearningPathSummary';

export default function LpListSection({ title, lps, userData }) {
    const learningPath = lps[0].data
    return (
        <div className="container my-6">
            <div className="text-4xl mb-4 font-bold tracking-tight text-gray-800 capitalize">{title.toLowerCase()}</div>
            {lps.map((lp) => (
                <div key={lp.id} className="mx-4 my-2">
                    <LearningPathSummary
                        learningPath={lp.data}
                        userData={userData}
                        shouldLinkToDetailPage
                    />
                </div>
            ))}
        </div>
    )
}