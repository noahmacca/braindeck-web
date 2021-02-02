import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import LpListSection from "../../components/LpListSection";
import LearningPathLoader from '../../components/LearningPathLoader';
import SectionHeader from '../../components/SectionHeader';
import { useRequireAuth } from '../../hooks/useAuth';
import { useDb } from "../../hooks/useDb";
import Link from 'next/link';

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
            if (db.user.learningPaths.some((userLp) => (userLp.id === uLp.id) && ((userLp.isFavorited === true) || (uLp.userData.completedContentIds.length > 0)))) {
                if (uLp.userData.progress === 0) {
                    displayLpsByCat.notStarted.push(uLp);
                } else if (uLp.userData.progress >= 1.0) {
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
                            {
                                !hasAnyLearningPath ?
                                    <div className="py-5 text-md text-gray-700 font-light">
                                        Go check out <Link href="/explore"><a>Explore</a></Link> and favorite some learning paths
                                    </div> :
                                    <div>
                                        {
                                            displayLpsByCat.inProgress.length > 0 &&
                                            <div className="my-2 md:my-6 md:mx-4">
                                                <SectionHeader text="In Progress" />
                                                <LpListSection lps={displayLpsByCat.inProgress} />
                                            </div>
                                        }
                                        {
                                            displayLpsByCat.notStarted.length > 0 &&
                                            <div className="my-2 md:my-6 md:mx-4">
                                                <SectionHeader text="Not Started" />
                                                <LpListSection lps={displayLpsByCat.notStarted} />
                                            </div>
                                        }
                                        {
                                            displayLpsByCat.complete.length > 0 &&
                                            <div className="my-2 md:my-6 md:mx-4">
                                                <SectionHeader text="Completed" />
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