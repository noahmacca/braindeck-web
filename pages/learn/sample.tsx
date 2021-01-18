import LearningPathView from '../../components/LearningPathView'
import PageHead from '../../components/PageHead'
import NavBar from '../../components/NavBar'

import { getLearningPathData } from '../../lib/learningPaths'
import { getUserData } from '../../lib/user'

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


export default function Sample({ learningPaths, users }) {
  return (
    <div>
      <PageHead />
      <NavBar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <LearningPathView
              learningPath={learningPaths[0].data}
              userData={users[0].data}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
