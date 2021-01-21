import LearningPathView from '../../components/LearningPathView'
import PageHead from '../../components/PageHead'
import NavBar from '../../components/NavBar'

import { getLearningPathById, getLearningPathIds, getLearningPathForUser } from '../../lib/learningPaths'
import { getUserById } from '../../lib/user'

export async function getStaticProps({ params }) {
  const learningPath = getLearningPathById(params.id);
  const user = getUserById('user1');
  const userLp = getLearningPathForUser(params.id, 'user1');
  console.log('userLp');
  console.log(userLp);
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
  return (
    <div>
      <PageHead title="BrainDeck Learning Path"/>
      <NavBar />
      <LearningPathView
        userLp={userLp}
      />
    </div>
  )
}
