import LearningPathSummary from './LearningPathSummary';
import Link from 'next/link';

export default function LpListSection({ title, lps, userData }) {
    const learningPath = lps[0].data
    return (
        <div className="container my-6">
            <div className="text-2xl mb-2 md:mb-4 tracking-tight text-gray-800 capitalize">{title.toLowerCase()}</div>
            {lps.map((lp) => (
                <div key={lp.id} className="md:mx-4 my-2">
                    <Link href={`/learn/${lp.id}`}>
                        <div className="cursor-pointer">
                            <LearningPathSummary
                                learningPath={lp.data}
                                userData={userData}
                                isCompact
                            />
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}