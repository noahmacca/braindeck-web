import Link from 'next/link';
import { useRouter } from 'next/router';
import { capitalizeFirst } from '../lib/utils';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const NavTab = (name, pathname) => (
    <Link href={`/${name.split(' ').join('-')}`}>
        {pathname.includes(`/${name}`) ?
            <span className="font-medium text-gray-700 cursor-pointer capitalize">{capitalizeFirst(name)}</span> :
            <span className="font-medium text-gray-400 hover:text-gray-700 cursor-pointer capitalize">{capitalizeFirst(name)}</span>
        }
    </Link>
)

const MobileNavTab = (name, pathname) => (
    <Link href={`/${name}`}>
        {pathname.includes(`/${name}`) ?
            <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-gray-50 capitalize" role="menuitem">{capitalizeFirst(name)}</a> :
            <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 capitalize" role="menuitem">{capitalizeFirst(name)}</a>
        }
    </Link>
)


export default function NavBar() {
    const router = useRouter();
    const auth = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div>
            <div className="relative p-6 px-4 sm:px-6 lg:px-8">
                <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
                    <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                        <div className="flex items-center justify-between w-full md:w-auto">
                            <Link href="/">
                                <a><img className="h-8 w-auto sm:h-10" src="/bdLogo-md.jpeg" /></a>
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                        {NavTab('explore', router.pathname)}
                        {NavTab('my courses', router.pathname)}
                        {NavTab('create', router.pathname)}
                        {auth.user && <span>{NavTab('profile', router.pathname)}</span>}
                        {
                            !auth.user ?
                            <Link href="/login">
                                <a className="px-3 py-2 rounded-md font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-600">Login</a>
                            </Link> :
                            <span onClick={() => auth.signOut()} className="px-3 py-2 rounded-md font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer">Logout</span>
                        }
                        {auth.user && <span>{auth.user.name}</span>}
                        {auth.user && <span>{auth.user.email}</span>}
                    </div>
                </nav>
            </div>
            <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-10">
                <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="px-5 p-4 flex items-center justify-between">
                        <Link href="/">
                            <a><img className="h-8 w-auto sm:h-10" src="/bdLogo-md.jpeg" /></a>
                        </Link>
                        {
                            isMenuOpen ?
                                <div className="-mr-2" onClick={() => setIsMenuOpen(false)}>
                                    <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <span className="sr-only">Close main menu</span>
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div> :
                                <div className="-mr-2 flex items-center md:hidden" onClick={() => setIsMenuOpen(true)}>
                                    <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" id="main-menu" aria-haspopup="true">
                                        <span className="sr-only">Open main menu</span>
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                        }
                    </div>
                    {
                        isMenuOpen &&
                        <div role="menu" aria-orientation="vertical" aria-labelledby="main-menu">
                            <div className="px-2 pt-2 pb-3 space-y-1" role="none">
                                {MobileNavTab('explore', router.pathname)}
                                {MobileNavTab('my courses', router.pathname)}
                                {MobileNavTab('create', router.pathname)}
                                {MobileNavTab('profile', router.pathname)}
                            </div>
                            <div role="none">
                                <a href="#" className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100" role="menuitem">
                                    Login
                                    </a>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}