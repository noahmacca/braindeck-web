import Link from 'next/link'
import NavBar from '../../components/navBar';

export default function Sample() {
  return (
    <div>
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
