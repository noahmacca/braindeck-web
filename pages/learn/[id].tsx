import LearningPathView from '../../components/LearningPathView';
import PageHead from '../../components/PageHead';
import NavBar from '../../components/NavBar';
import { db } from '../../config/firebase';
import LearningPathLoader from '../../components/LearningPathLoader';
import { useRouter } from 'next/router';

export default function LearningPathViewById() {
    const router = useRouter();
    const lpId: string = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id

    return (
        <div>
            <PageHead title="BrainDeck Learning Path" />
            <NavBar />
            <LearningPathLoader>
                <LearningPathView
                    lpId={lpId}
                />
            </LearningPathLoader>
        </div>
    )
}
