import LearningPathView from '../../components/LearningPathView'
import PageHead from '../../components/PageHead'
import NavBar from '../../components/NavBar'

import { getLearningPathData } from '../../lib/learningPaths'

export async function getStaticProps() {
    const learningPaths = getLearningPathData()
    return {
        props: {
          learningPaths
        }
    }
}


export default function Sample({ learningPaths }) {
  const userData = {
    lps: [
      {
        'id': 1,
        'favorite': false,
        'complete': false
      }
    ],
  }
  return (
    <div>
      <PageHead />
      <NavBar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <LearningPathView
              learningPath={learningPaths[0].data}
              userLps={userData.lps}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
