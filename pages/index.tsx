import PageHead from '../components/PageHead'
import Link from 'next/link'
// import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <PageHead />
      <div>
        <h1>Braindeck</h1>
        <p>Become an expert in anything.</p>
        <div>
          <Link href="/learn/sample">
            <button className="btn btn-primary" type="button">Enter</button>
          </Link>
        </div>
      </div>
      <footer className="navbar fixed-bottom navbar-light py-3 bg-light">
        <div className="container">
          <span className="text-muted">Tweet or message <a href="https://twitter.com/noahmacca">@noahmacca</a> with feedback.</span>
        </div>
      </footer>
    </>
  )
}
