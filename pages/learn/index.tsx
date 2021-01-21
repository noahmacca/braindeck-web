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
                        <LpListSection
                            title="In Progress"
                            userLps={userLpsByCat.lpFavoriteInProgress}
                            subjectId={undefined}
                        />
                        <LpListSection
                            title="Not Started"
                            userLps={userLpsByCat.lpFavoriteNotStarted}
                            subjectId={undefined}
                        />
                        <LpListSection
                            title="Complete"
                            userLps={userLpsByCat.lpCompleted}
                            subjectId={undefined}
                        />
                        {
                            userLpsByCat.lpCompletedButNewContent.length > 0 ?
                            <LpListSection
                                title="New Content Since Completed"
                                userLps={userLpsByCat.lpCompletedButNewContent}
                                subjectId={undefined}
                            /> : undefined
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}