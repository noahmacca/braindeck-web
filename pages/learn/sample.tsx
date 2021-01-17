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
  return (
    <div>
      <PageHead />
      <NavBar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <LearningPathView
              learningPath={learningPaths[0]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
