import LearningPathSummary from './LearningPathSummary';
import Link from 'next/link';
import { LearningPathUser } from '../hooks/types';

export default function LpListSection({ lps }: { lps: Array<LearningPathUser> }) {
    return (
        <div>
            {lps.map((lp) => (
                <div key={lp.id} className=" mb-2">
                    <LearningPathSummary
                        lp={lp}
                        isCompact={false}
                    />
                </div>
            ))}
        </div>
    )
}