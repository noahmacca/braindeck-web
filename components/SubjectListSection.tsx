import Link from 'next/link';

export default function SubjectListSection({ subjects }) {
    return (
        <div className="my-2 md:my-4">
            <div className="grid md:mt-3 md:mx-0 grid-cols-1 md:grid-cols-3 md:gap-2 md:text-center">
                {
                    subjects.map((subject) => (
                        <div key={subject.id} className="cursor-pointer">
                            <Link href={`/subject/${subject.id}`}>
                                <div className="capitalize text-gray-600 font-light md:text-lg px-4 md:px-0 py-2 md:py-4 hover:bg-gray-100 rounded-lg">{subject.name.toLowerCase()}</div>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}