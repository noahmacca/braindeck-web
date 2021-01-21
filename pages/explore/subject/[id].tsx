import PageHead from '../../../components/PageHead'
import NavBar from '../../../components/NavBar'
import LpListSection from "../../../components/LpListSection";
import { compareCountFavorite } from '../../../lib/utils';

import { getLearningPathDataBySubject, getLearningPathSubjectPaths } from '../../../lib/learningPaths'
import { getUserById } from '../../../lib/user'

export async function getStaticProps({ params }) {
    const user = getUserById('user1');
    const subjectUserLps = getLearningPathDataBySubject(user.data)[params.id];
    const uLps = subjectUserLps.uLps;
    uLps.sort(compareCountFavorite);
    return {
        props: {
            uLps,
            subject: {
                id: params.id,
                name: subjectUserLps.name
            }
        }
    }
}

export async function getStaticPaths() {
    const paths = getLearningPathSubjectPaths();
    return {
        paths,
        fallback: false
    }
}

export default function DemoLearningPath({ uLps, subject }) {
    return (
        <div>
            <PageHead title={`BrainDeck Explore ${subject.name}`} />
            <NavBar />
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto px-6 mt-6 max-w-4xl">
                    <div className="container mb-6 md:mb-10">
                        <h1>Explore</h1>
                        {
                            <LpListSection
                                key={`${subject.id}`}
                                subjectId={subject.id}
                                title={subject.name}
                                userLps={uLps}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
