import _ from 'lodash';
import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import LpListSection from "../../components/LpListSection";
import SubjectListSection from "../../components/SubjectListSection";
import { getLearningPathData } from '../../lib/learningPaths';
import { getUserData } from '../../lib/user';

export async function getStaticProps() {
    const learningPaths = getLearningPathData()
    const users = getUserData()
    return {
      props: {
        learningPaths,
        users
      }
    }
  }

export default function Explore({ learningPaths, users }) {
    // Page layout
    // Search (eventually)
    // Filters (by length, difficulty, modality)

    // Sections (Dynamically generated by popularity)
    // Popular (Overall)
    // Section 1
    // Section 2
    // Section 3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    // More sections (SubjectList)

    // Within each section: 5 learning paths with summaries, and a link to more learning paths (SubjectLearningPaths)
    const subjects = ['BIOLOGY', 'MACHINE LEARNING'];
    const lpsBySubject = {};
    learningPaths.forEach((lp) => {
        const subject = lp.data.subject;
        console.log(subject);
        if (!(subject in lpsBySubject)) {
            lpsBySubject[subject] = []
        }
        lpsBySubject[subject].push(lp)
    });
    console.log(lpsBySubject);

    return (
        <div>
            <PageHead title="BrainDeck Explore" />
            <NavBar />
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto px-6 max-w-4xl">
                    {
                        subjects.map((subject) => (
                            <LpListSection
                                title={subject}
                                lps={lpsBySubject[subject]}
                                userData={users[0].data}
                            />
                        ))
                    }
                    <SubjectListSection
                        lpSubjects={[]}
                    />
                </div>
            </div>
        </div>
    )
}