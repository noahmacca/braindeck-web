import styles from './navBar.module.css'
import Link from 'next/link'

export default function NavBar() {
    return (
        <div className={styles.container}>
            <Link href="/">
                <div className={styles.navItemLeft}>
                    Noah's Learning Path
                </div>
            </Link>
            <div className={styles.buttonRight} onClick={() => alert('Coming Soon')}>
                Login
            </div>
        </div>
    )
}
