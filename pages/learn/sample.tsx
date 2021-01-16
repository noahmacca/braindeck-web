import PageHead from '../../components/PageHead'
import Navigationbar from '../../components/Navigationbar'
import GraphDisplay from '../../components/GraphDisplay'

export default function Sample() {
  return (
    <div>
      <PageHead />
      <Navigationbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <GraphDisplay />
          </div>
        </div>
      </div>
    </div>
  )
}
