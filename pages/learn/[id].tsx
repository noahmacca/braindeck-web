import LearningPathView from '../../components/LearningPathView';
import PageHead from '../../components/PageHead';
import NavBar from '../../components/NavBar';
import { useDb } from '../../hooks/useDb';
import { db } from '../../config/firebase';
import LearningPathLoader from '../../components/LearningPathLoader';

export async function getStaticProps({ params }) {
    return {
        props: {
            paramId: params.id
        }
    }
}

export async function getStaticPaths() {
    const lps = await db.collection('learningPaths').get()
    const paths = lps.docs.map((doc) => ({
        params: {
            id: doc.id
        }
    }));

    return {
        paths,
        fallback: false
    }
}

export default function LearningPathViewById({ paramId }: { paramId: string }) {
    const db = useDb();

    return (
        <div>
            <PageHead title="BrainDeck Learning Path" />
            <NavBar />
            <LearningPathLoader>
                <LearningPathView
                    lpId={paramId}
                />
            </LearningPathLoader>
        </div>
    )
}
