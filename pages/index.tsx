import PageHead from '../components/PageHead'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const auth = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (auth.userId) {
            router.push('/favorites');
        }
    }, [auth]);
    return (
        <>
            <PageHead title="BrainDeck" />
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            <polygon points="50,0 100,0 50,100 0,100" />
                        </svg>
                        <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                            <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
                                <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                                    <div className="flex items-center justify-between w-full md:w-auto">
                                        <a href="#">
                                            <img className="h-8 w-auto sm:h-10" src="/bdLogo-md.jpeg" />
                                        </a>
                                    </div>
                                </div>
                                <div className="block md:ml-10 md:pr-4 space-x-8">
                                    <Link href="/explore">
                                        <a className="font-medium text-gray-600 hover:text-gray-700 cursor-pointer">Explore</a>
                                    </Link>
                                    {!auth.userId && <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-400">Log in</a>}
                                </div>
                            </nav>
                        </div>
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block">BrainDeck</span>
                                    <span className="block text-indigo-600 text-3xl sm:text-4xl md:text-5xl">Learn Anything</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Ramp up on any topic with curated learning paths from the world's experts. Join a cohort with other talented people to supercharge your learning.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md">
                                        <Link href="/explore">
                                            <a className="w-full underline flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-gray-500 hover:text-gray-600 md:py-3 md:text-lg md:px-10 cursor-pointer">
                                                Explore
                                            </a>
                                        </Link>
                                    </div>
                                    <div className="rounded-md shadow">
                                        <a href="http://cohort-signup.braindeck.io">
                                            <a className="w-full flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-lg md:px-10 cursor-pointer">
                                                Apply for Cohort
                                            </a>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full hero-image-pattern"></div>
                </div>
            </div>
        </>
    )
}
