import Link from 'next/link'
import { useRouter } from 'next/router'

function capFirst(string) {
    // capitalize css doesn't work for adjacent spans T.T
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

const SelectedLink = (text) => <span className="font-medium text-gray-600 cursor-pointer">{text}</span>
const UnselectedLink = (text) => <span className="font-medium text-gray-400 hover:text-gray-600 cursor-pointer">{text}</span>
const NavTab = (name, pathname) => <Link href={`/${name}`}>{ pathname.includes(`/${name}`) ? SelectedLink(capFirst(name)) : UnselectedLink(capFirst(name)) }</Link>

export default function NavBar() {
    const router = useRouter();
    console.log(router.pathname);

    return (
        <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
                <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <Link href="/">
                            <a><img className="h-8 w-auto sm:h-10" src="/bdLogo-md.jpeg" /></a>
                        </Link>
                    </div>
                </div>
                <div className="block md:ml-10 md:pr-4 space-x-8 w-100">
                    { NavTab('learn', router.pathname) }
                    { NavTab('explore', router.pathname) }
                    { NavTab('create', router.pathname) }
                    { NavTab('profile', router.pathname) }
                    { NavTab('demo', router.pathname) }
                    <Link href="/login">
                        <a className="px-3 py-2 border border-indigo-600 rounded-md font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-600">Log in</a>
                    </Link>
                </div>
            </nav>
        </div>
    )
}