import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import { getUserById } from '../../lib/user';
import Link from 'next/link';

export async function getStaticProps() {
    const user = getUserById('user1');
    return {
        props: {
            user,
        }
    }
}

export default function Profile({ user }) {
    return (
        <div>
            <PageHead title="BrainDeck Home"/>
            <NavBar />
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto px-6 mt-6 max-w-4xl">
                    <div className="container mb-6 md:mb-10">
                        <div className="mt-3 text-3xl font-semibold">{user.data.firstName} {user.data.lastName}</div>
                        <div className="mt-3 text-l font-semibold">Info</div>
                        <div className="mx-3 mb-3">
                            <div className='font-light'>Joined on 01/10/2020</div>
                        </div>
                        <div className="mt-3 text-l font-semibold">Learning Paths</div>
                        <div className="mx-3 mb-3">
                            <div className='font-light'>Favorited: {user.data.enrolledLps.filter(i => i.isFavorite === true).length}</div>
                            <div className='font-light'>Completed: {user.data.enrolledLps.filter(i => i.isComplete === true).length}</div>
                        </div>
                        <div className="mt-3 text-l font-semibold">Learning Resources</div>
                        <div className="mx-3 mb-3">
                            <div className="mb-3 font-light">Completed: {user.data.contents.length}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}