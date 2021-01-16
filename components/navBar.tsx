import styles from './navBar.module.css'


export default function NavBar() {
    return (
        <div className={styles.container}>
            <div className={styles.navItemLeft}>
                Noah's Learning Path
            </div>
            <div className={styles.buttonRight} onClick={() => alert('Coming Soon')}>
                Login
            </div>
        </div>
    )
}
