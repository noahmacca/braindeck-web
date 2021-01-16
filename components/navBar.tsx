import Head from 'next/head'

export default function NavBar() {
    return (
        <div>
            <Head>
                <title>Braindeck</title>
                <link rel="icon" href="/favicon.ico" />
                <meta property="og:title" content="BrainDeck" />
                <meta property="og:description" content="Share your knowledge." />
            </Head>
            NavBar
        </div>
    )
}
