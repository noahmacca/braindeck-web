import _ from 'lodash';
import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import LpListSection from "../../components/LpListSection";
import SubjectListSection from "../../components/SubjectListSection";
import { getLearningPathDataBySubject } from '../../lib/learningPaths';
import { getUserById } from '../../lib/user';
import { compareMaxFavorite, compareCountFavorite } from '../../lib/utils';
const NUM_TOP_SUBJECTS = 2;
const NUM_REMAINING_SUBJECTS = 9;

export async function getStaticProps() {
    const user = getUserById('user1');
    const subUserLps = getLearningPathDataBySubject(user.data);
    const subLpsArr = Object.keys(subUserLps).map(key => subUserLps[key]); // TS prefers this way to splat to arr
    subLpsArr.sort(compareMaxFavorite);
    subLpsArr.forEach((subLps) => {
        subLps.uLps.sort(compareCountFavorite).slice(0, 5); // take the top 5 favorited in each section
    })
    return {
        props: {
            subLpsArr,
            user
        }
    }
}


export default function Explore({ subLpsArr, user }) {
    // Page layout
    // Search (eventually)
    // Filters (by length, difficulty, modality)

    // Sections (Dynamically generated by popularity)
    // Popular (Overall)
    // Section 1
    // Section 2
    // Section 3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    // More sections (SubjectList)

    const topSubjectLps = subLpsArr.slice(0, NUM_TOP_SUBJECTS);
    const remainingSubjects = subLpsArr.slice(NUM_TOP_SUBJECTS, NUM_TOP_SUBJECTS + NUM_REMAINING_SUBJECTS)

    return (
        <div>
            <PageHead title="BrainDeck Explore" />
            <NavBar />
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto px-6 mt-6 max-w-4xl">
                    <div className="container mb-6 md:mb-10">
                        <h1>Top</h1>
                        {
                            topSubjectLps.map((sLp) => (
                                <LpListSection
                                    key={`${sLp.id}`}
                                    title={sLp.name}
                                    userLps={sLp.uLps}
                                    subjectId={sLp.id}
                                />
                            ))
                        }
                    </div>
                    <div className="container mb-2">
                        <h1>All Subjects</h1>
                        <SubjectListSection
                            sLps={remainingSubjects}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}