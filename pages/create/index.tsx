import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import { getCreatedLearningPathsForUser } from '../../lib/learningPaths';
import { getUserById } from '../../lib/user';
import LpListSection from "../../components/LpListSection";
import { useRequireAuth } from '../../hooks/useAuth';

export async function getStaticProps() {
    const user = getUserById('user1');
    const userCreatedLps = getCreatedLearningPathsForUser(user.data);
    return {
        props: {
            userCreatedLps,
        }
    }
}

export default function Create({ userCreatedLps }) {
    // Page layout
    // Show all of the user's created learning paths. Can edit each one, and create new ones.
    useRequireAuth();

    return (
        <div>
            <PageHead title="BrainDeck Create" />
            <NavBar />
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto px-6 mt-6 max-w-4xl">
                    <div className="container mb-4 md:mb-6">
                        <h1 className="mb-3">Your Created Learning Paths</h1>
                        <LpListSection userLps={userCreatedLps} />
                    </div>
                </div>
            </div>
        </div>
    )
}