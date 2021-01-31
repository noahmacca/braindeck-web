import LearningPathView from '../../components/LearningPathView';
import PageHead from '../../components/PageHead';
import NavBar from '../../components/NavBar';
import Spinner from '../../components/icons/Spinner';
import { useDb } from '../../hooks/useDb';
import { db } from '../../config/firebase';

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
            {
                (db.userLearningPaths.length === 0) ?
                    <div className="flex justify-center my-40">
                        <Spinner width="80" fill="#7C3AED" className="animate-spin" />
                    </div> :
                    <LearningPathView
                        lpId={paramId}
                    />
            }
        </div>
    )
}
