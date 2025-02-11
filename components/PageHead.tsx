import Head from 'next/head'

export default function PageHead({ title }) {
    return (
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/favicon.ico" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content="Ramp up on anything with curated learning paths from the world's experts." />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        </Head>
    )
}