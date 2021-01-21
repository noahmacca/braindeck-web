import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import { getLearningPathsForUser } from '../../lib/learningPaths';
import { getUserById } from '../../lib/user';
import LpListSection from "../../components/LpListSection";

export async function getStaticProps() {
    const user = getUserById('user1');
    const userLpsByCat = getLearningPathsForUser(user.data);
    return {
        props: {
            user,
            userLpsByCat
        }
    }
}

export default function Learn({ userLpsByCat, user }) {
    // Page layout
    // Show all of the user's learning paths, favorited + not started, favorited + in progress, complete
    // {
    //     lpCompleted: [],
    //     lpCompletedButNewContent: [],
    //     lpFavoriteInProgress: [],
    //     lpFavoriteNotStarted: []
    // }

    return (
        <div>
            <PageHead title="BrainDeck Learn" />
            <NavBar />
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto px-6 mt-6 max-w-4xl">
                    <div className="container mb-4 md:mb-6">
                        <h1>Your Learning Paths</h1>
                        <div className="my-2 md:my-6 md:mx-4">
                            <div className="text-xl md:mb-1 tracking-tight font-light text-gray-600 capitalize inline-block">
                                In Progress
                            </div>
                            <LpListSection userLps={userLpsByCat.lpFavoriteInProgress} />
                        </div>
                        <div className="my-2 md:my-6 md:mx-4">
                            <div className="text-xl md:mb-1 tracking-tight font-light text-gray-600 capitalize inline-block">
                                Not Started
                            </div>
                            <LpListSection userLps={userLpsByCat.lpFavoriteNotStarted} />
                        </div>
                        <div className="my-2 md:my-6 md:mx-4">
                            <div className="text-xl md:mb-1 tracking-tight font-light text-gray-600 capitalize inline-block">
                                Complete
                            </div>
                            <LpListSection userLps={userLpsByCat.lpCompleted} />
                        </div>
                        {
                            userLpsByCat.lpCompletedButNewContent.length > 0 ?
                                <div className="my-2 md:my-6 md:mx-4">
                                    <div className="text-xl md:mb-1 tracking-tight font-light text-gray-600 capitalize inline-block">
                                        Previously Complete (New Content Added)
                                    </div>
                                    <LpListSection userLps={userLpsByCat.lpCompletedButNewContent} />
                                </div> :
                                undefined
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}