import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import { getCreatedLearningPathsForUser } from '../../lib/learningPaths';
import { getUserById } from '../../lib/user';
import LpListSection from "../../components/LpListSection";

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
    return (
        <div>
            <PageHead title="BrainDeck Create"/>
            <NavBar />
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto px-6 mt-6 max-w-4xl">
                    <div className="container mb-4 md:mb-6">
                        <div
                            className="py-2 px-4 bg-green-100 rounded-lg cursor-pointer"
                            onClick={() => alert('Coming Soon!')}
                        >
                            New
                        </div>
                    </div>
                    <div className="container mb-4 md:mb-6">
                        <h1>Your Created Learning Paths</h1>
                        <LpListSection userLps={userCreatedLps} />
                    </div>
                </div>
            </div>
        </div>
    )
}