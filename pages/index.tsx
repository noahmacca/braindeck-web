import Head from '../components/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head />
      <main className={styles.main}>
        <div className={styles.title}>Braindeck</div>
        <div className={styles.description}>A place to share your brain. Because you are the best discovery engine.</div>
        <Link href="/learn/sample">
        <button className={styles.ctaButton}>
            Enter
          </button>
        </Link>
      </main>
      <footer className={styles.footer}>
        <div>
          Feedback? Please{' '}
          <a href="mailto:noahmacca@gmail.com"> send us an email.</a>
        </div>
      </footer>
    </div>
  )
}
