import LearningPathView from '../../components/LearningPathView'
import PageHead from '../../components/PageHead'
import NavBar from '../../components/NavBar'

import { getLearningPathById, getLearningPathIds } from '../../lib/learningPaths'
import { getUserById } from '../../lib/user'

export async function getStaticProps({ params }) {
  const learningPath = getLearningPathById(params.id);
  const user = getUserById('user1');
  return {
    props: {
      learningPath,
      user
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

export default function DemoLearningPath({ learningPath, user }) {
  return (
    <div>
      <PageHead title="BrainDeck Learning Path"/>
      <NavBar />
      <LearningPathView
        learningPath={learningPath.data}
        userData={user.data}
      />
    </div>
  )
}
