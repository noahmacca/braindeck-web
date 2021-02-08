import LearningPathSummaryListItem from './LearningPathSummaryListItem';
import { LearningPathUser } from '../hooks/types';

export default function LpListSection({ lps }: { lps: Array<LearningPathUser> }) {
    return (
        <div>
            {lps.map((lp) => (
                <div key={lp.id} className="mb-3">
                    <LearningPathSummaryListItem
                        lp={lp}
                    />
                </div>
            ))}
        </div>
    )
}