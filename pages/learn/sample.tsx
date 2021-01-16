import Head from '../../components/Head';
import Navbar from '../../components/Navbar';
import GraphDisplay from '../../components/GraphDisplay'

export default function Sample() {
  return (
    <div>
      <Head />
      <Navbar />
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
