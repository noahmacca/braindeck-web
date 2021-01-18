import Link from 'next/link'

export default function NavBar() {
    return (
        <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
                <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <Link href="/">
                            <a>
                                <span className="sr-only">Workflow</span>
                                <img className="h-8 w-auto sm:h-10" src="/bdLogo-md.jpeg" />
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="block md:ml-10 md:pr-4 space-x-8">
                    <span className="font-medium text-gray-400 cursor-default">Home</span>
                    <span className="font-medium text-gray-400 cursor-default">Explore</span>
                    <span className="font-medium text-gray-400 cursor-default">Create</span>
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</a>
                </div>
            </nav>
        </div>
    )
}