import PageHead from '../../../components/PageHead'
import NavBar from '../../../components/NavBar'
import LpListSection from "../../../components/LpListSection";
import { compareCountFavorite } from '../../../lib/utils';

import { getLearningPathDataBySubject } from '../../../lib/learningPaths'
import { getUserById } from '../../../lib/user'

export async function getStaticProps({ params }) {
    const user = getUserById('user1');
    const sLps = getLearningPathDataBySubject()[params.id];
    const lps = sLps.lps;
    lps.sort(compareCountFavorite);
    return {
        props: {
            lps: sLps.lps,
            user,
            subject: {
                id: params.id,
                name: sLps.name
            }
        }
    }
}

export async function getStaticPaths() {
    const subLps = getLearningPathDataBySubject();
    const paths = Object.keys(subLps).map(k => (
        {
            params: {
                id: k
            }
        }
    ));
    return {
        paths,
        fallback: false
    }
}

export default function DemoLearningPath({ lps, user, subject }) {
    return (
        <div>
            <PageHead title="BrainDeck Explore Subject" />
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
                                lps={lps}
                                userData={user.data}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
