import Link from 'next/link'
import Head from '../../components/head';
import NavBar from '../../components/navBar';

export default function Sample() {
  return (
    <div>
      <Head />
      <NavBar />
      <main>
        <div>Learning Path</div>
        <Link href="/">
          <button>
            Home
          </button>
        </Link>
      </main>
    </div>
  )
}
