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
        id: 1,
        favorite: true,
        complete: false
      }
    ],
    contents: [
      {
        id: "1.1.1",
        complete: true
      },
      {
        id: "1.2.1",
        complete: true
      },
      {
        id: "1.5.2",
        complete: true
      },
      {
        id: "1.6.2",
        complete: true
      },
    ]
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
              userData={userData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
