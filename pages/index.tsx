import Head from '../components/PageHead'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head />
      <main>
        <div className="container d-flex flex-column align-content-center">
          <div style={{ marginTop: '25vh' }} className="row text-center align-middle">
            <div className="col">
              <h1 className={styles.title}>Braindeck</h1>
              <p className="lead">Become an expert in anything.</p>
              <div className="d-grid gap-2 col-2 mx-auto my-5">
                <Link href="/learn/sample">
                  <button className="btn btn-primary" type="button">Enter</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="navbar fixed-bottom navbar-light py-3 bg-light">
        <div className="container">
          <span className="text-muted">Tweet or message <a href="https://twitter.com/noahmacca">@noahmacca</a> with feedback.</span>
        </div>
      </footer>
    </>
  )
}
