import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";
import { getLearningPathsForUser } from '../../lib/learningPaths';
import { getUserById } from '../../lib/user';

export async function getStaticProps() {
    const user = getUserById('user1');
    const lps = getLearningPathsForUser(user.data);
    console.log('learn index');
    console.log(lps)
    return {
        props: {
            lps,
            user
        }
    }
}

export default function Learn() {
    // Page layout
    // Show all of the user's learning paths, favorited + not started, favorited + in progress, complete

    return (
        <div>
            <PageHead title="BrainDeck Learn" />
            <NavBar />
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto px-6 mt-6 max-w-4xl">
                    <div className="container mb-4 md:mb-6">
                        <h1>In Progress</h1>
                    </div>
                    <div className="container mb-4 md:mb-6">
                        <h1>Backlog</h1>
                    </div>
                    <div className="container mb-4 md:mb-6">
                        <h1>Complete</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}