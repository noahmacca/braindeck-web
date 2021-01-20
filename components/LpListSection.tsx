import LearningPathSummary from './LearningPathSummary';
import Link from 'next/link';

export default function LpListSection({ title, lps, userData }) {
    const learningPath = lps[0].data
    return (
        <div className="container my-2 md:my-4 md:mx-4">
            <div className="text-xl md:mb-1 tracking-tight font-light text-gray-600 capitalize">{title.toLowerCase()}</div>
            {lps.map((lp) => (
                <div key={lp.id} className=" my-2">
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