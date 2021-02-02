import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import LpListSection from "../../components/LpListSection";
import LearningPathLoader from '../../components/LearningPathLoader';
import { useDb } from '../../hooks/useDb';
import SectionHeader from "../../components/SectionHeader";

const NUM_DISPLAY_LPS = 20;

function compareByCountFavorites(a, b) {
    if (a.data.countFavorite < b.data.countFavorite) {
        return 1;
    }
    if (a.data.countFavorite > b.data.countFavorite) {
        return -1;
    }
    return 0;
}

export default function ExploreIndex({ subLpsArr }) {
    // Page layout
    const db = useDb();
    const uLps = db.userLearningPaths;
    uLps.sort(compareByCountFavorites)

    return (
        <div>
            <PageHead title="BrainDeck Explore" />
            <NavBar />
            <LearningPathLoader>
                <div className="relative bg-white overflow-hidden">
                    <div className="mx-auto px-6 mt-6 max-w-4xl">
                        <div className="container mb-4 md:mb-6">
                            <SectionHeader text="Top Learning Paths" />
                            <LpListSection lps={uLps.slice(0,NUM_DISPLAY_LPS)} />
                        </div>
                    </div>
                </div>
            </LearningPathLoader>
        </div>
    )
}