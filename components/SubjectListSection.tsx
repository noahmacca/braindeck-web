export default function SubjectListSection({ subjects }) {
    return (
        <div className="my-2 md:my-4">
            <div className="grid mx-4 md:mt-3 md:mx-0 grid-cols-1 md:grid-cols-3 md:gap-4 md:text-center">
                {
                    subjects.map((subject) => (
                        <div className="capitalize text-gray-600 font-light md:text-lg py-2 md:py-3">{subject.toLowerCase()}</div>
                    ))
                }
            </div>
        </div>
    )
}