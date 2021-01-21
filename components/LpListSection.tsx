import LearningPathSummary from './LearningPathSummary';
import { CaretRightFill, CheckSquareFill } from 'react-bootstrap-icons';
import Link from 'next/link';

export default function LpListSection({ title, lps, subjectId, userData }) {
    return (
        <div className="my-2 md:my-4 md:mx-4">
                <Link href={`/explore/subject/${subjectId}`}>
                    <div className="cursor-pointer max-w-none">
                        <div className="text-xl md:mb-1 tracking-tight font-light text-gray-600 capitalize inline-block">
                            {title.toLowerCase()}
                        </div>
                        <CaretRightFill className="ml-1 mb-1 inline-block" size={10} />
                    </div>
                </Link>
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