import LearningPathSummary from './LearningPathSummary';
import { CaretRightFill, CheckSquareFill } from 'react-bootstrap-icons';
import Link from 'next/link';

export default function LpListSection({ title, userLps, subjectId }) {
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
            {userLps.map((uLp) => (
                <div key={uLp.id} className=" my-2">
                    <Link href={`/learn/${uLp.id}`}>
                        <div className="cursor-pointer">
                            <LearningPathSummary
                                userLp={uLp}
                                isCompact
                            />
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}