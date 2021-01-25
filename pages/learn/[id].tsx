import LearningPathView from '../../components/LearningPathView'
import PageHead from '../../components/PageHead'
import NavBar from '../../components/NavBar'
import { useRequireAuth } from '../../hooks/useAuth';

import { getLearningPathIds, getLearningPathForUser } from '../../lib/learningPaths'

export async function getStaticProps({ params }) {
    const userLp = getLearningPathForUser(params.id, 'user1');
    return {
        props: {
            userLp
        }
    }
}

export async function getStaticPaths() {
    const paths = getLearningPathIds()
    return {
        paths,
        fallback: false
    }
}

export default function DemoLearningPath({ userLp }) {
    useRequireAuth();

    return (
        <div>
            <PageHead title="BrainDeck Learning Path" />
            <NavBar />
            <LearningPathView
                userLp={userLp}
            />
        </div>
    )
}
