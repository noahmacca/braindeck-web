import PageHead from '../../components/PageHead'
import NavBar from '../../components/NavBar'
import GraphDisplay from '../../components/GraphDisplay'

export default function Sample() {
  return (
    <div>
      <PageHead />
      <NavBar />
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
