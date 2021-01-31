import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import { getLearningPathsForUser } from '../../lib/learningPaths';
import { getUserById } from '../../lib/user';
import LpListSection from "../../components/LpListSection";
import LearningPathLoader from '../../components/LearningPathLoader';
import { useRequireAuth } from '../../hooks/useAuth';
import { useDb } from "../../hooks/useDb";

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

function compareByDataUpdated(a, b) {
    if (a.data.updated < b.data.updated) {
        return 1;
    }
    if (a.data.updated > b.data.updated) {
        return -1;
    }
    return 0;
}


export default function MyCoursesIndex() {
    // Page layout
    // Show all of the user's learning paths, favorited + not started, favorited + in progress, complete

    useRequireAuth();
    const db = useDb();

    const displayLpsByCat = {
        'complete': [],
        'notStarted': [],
        'inProgress': []
    };
    let hasAnyLearningPath = false;
    if (db.userLearningPaths && db.user) {
        db.userLearningPaths.forEach((uLp) => {
            const uLpProgress = uLp.userData.numLearningResourcesTotal > 0 ? uLp.userData.completedContentIds.length / uLp.userData.numLearningResourcesTotal : 0
            if (db.user.learningPaths.some((userLp) => (userLp.id === uLp.id) && ((userLp.isFavorited === true) || (uLp.userData.completedContentIds.length > 0)))) {
                if (uLpProgress === 0) {
                    displayLpsByCat.notStarted.push(uLp);
                } else if (uLpProgress >= 1.0) {
                    displayLpsByCat.complete.push(uLp);
                } else {
                    displayLpsByCat.inProgress.push(uLp);
                }
                hasAnyLearningPath = true
            }
        })

        displayLpsByCat.complete.sort(compareByDataUpdated);
        displayLpsByCat.notStarted.sort(compareByDataUpdated);
        displayLpsByCat.inProgress.sort(compareByDataUpdated);
    }

    return (
        <div>
            <PageHead title="BrainDeck Learn" />
            <NavBar />
            <LearningPathLoader>
                <div className="relative bg-white overflow-hidden">
                    <div className="mx-auto px-6 mt-6 max-w-4xl">
                        <div className="container mb-4 md:mb-6">
                            <h1>Your Learning Paths</h1>
                            {
                                !hasAnyLearningPath ?
                                <div className="p-5 text-md text-gray-700 font-light">
                                    Go favorite some learning paths!
                                </div> :
                                <div>
                                    {
                                        displayLpsByCat.inProgress &&
                                        <div className="my-2 md:my-6 md:mx-4">
                                            <div className="text-xl md:mb-1 tracking-tight font-light text-gray-600 capitalize inline-block">
                                                In Progress
                                        </div>
                                            <LpListSection lps={displayLpsByCat.inProgress} />
                                        </div>
                                    }
                                    {
                                        displayLpsByCat.notStarted.length > 0 &&
                                        <div className="my-2 md:my-6 md:mx-4">
                                            <div className="text-xl md:mb-1 tracking-tight font-light text-gray-600 capitalize inline-block">
                                                Not Started
                                            </div>
                                            <LpListSection lps={displayLpsByCat.notStarted} />
                                        </div>
                                    }
                                    {
                                        displayLpsByCat.complete.length > 0 &&
                                        <div className="my-2 md:my-6 md:mx-4">
                                            <div className="text-xl md:mb-1 tracking-tight font-light text-gray-600 capitalize inline-block">
                                                Complete
                                            </div>
                                            <LpListSection lps={displayLpsByCat.complete} />
                                        </div>
                                    }
                                </div>

                            }
                        </div>
                    </div>
                </div>
            </LearningPathLoader>
        </div>
    )
}