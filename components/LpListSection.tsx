import LearningPathSummary from './LearningPathSummary';
import Link from 'next/link';

export default function LpListSection({ userLps }) {
    return userLps.map((uLp) => (
        <div key={uLp.id} className=" mb-2">
            <Link href={`/learn/${uLp.id}`}>
                <div className="cursor-pointer">
                    <LearningPathSummary
                        userLp={uLp}
                        isCompact
                    />
                </div>
            </Link>
        </div>
    ))
}