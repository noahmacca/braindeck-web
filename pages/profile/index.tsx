import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import { getUserById } from '../../lib/user';
import { useRequireAuth } from '../../hooks/useAuth';
import { useDb } from '../../hooks/useDb';


export async function getStaticProps() {
    const user = getUserById('user1');
    return {
        props: {
            user,
        }
    }
}

export default function Profile() {
    const auth = useRequireAuth();
    const db = useDb();

    return (
        <div>
            <PageHead title="BrainDeck Home" />
            <NavBar />
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto px-6 mt-6 max-w-4xl">
                    <div className="container mb-6 md:mb-10 text-gray-700">
                        <div className="mt-3 text-2xl font-semibold">Welcome back, {db.user?.name}!</div>
                        <div className="mt-3 text-l font-semibold">Info</div>
                        <div className="mx-3 mb-3">
                            <div className='font-light'>{db.user?.email}</div>
                            {db.user?.created &&
                                <div className='font-light'>Joined on {new Date(db.user.created).toLocaleDateString('en-US')}
                                </div>
                            }
                        </div>
                        <div className="mt-3 text-l font-semibold">Learning Paths</div>
                        <div className="mx-3 mb-3">
                            <div className='font-light'>Favorited: {db.user?.enrolledLps ? db.user.enrolledLps.filter(i => i.isFavorite === true).length : 0}</div>
                            <div className='font-light'>Completed: {db.user?.enrolledLps ? db.user.enrolledLps.filter(i => i.isComplete === true).length : 0}</div>
                        </div>
                        <div className="mt-3 text-l font-semibold">Learning Resources</div>
                        <div className="mx-3 mb-3">
                            <div className="mb-3 font-light">Completed: {db.user?.learningResources ? db.user.learningResources.length : 0}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}