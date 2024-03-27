import '@/styles/globals.css'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function App ({ Component, pageProps }) {
	const router = useRouter()
	const articleClass = router.pathname.split('/').pop()

	return <>
		<Head>
			<link rel='apple-touch-icon' sizes='180x180' href='/static/images/favicon/apple-touch-icon.png' />
			<link rel='icon' type='image/png' sizes='32x32' href='/static/images/favicon/favicon-32x32.png' />
			<link rel='icon' type='image/png' sizes='16x16' href='/static/images/favicon/favicon-16x16.png' />

			<link rel='preload' href='/static/fonts/BBCReithSans_Rg-subset.woff2' as='font' />

			<meta name='description' content='BBC Research & Development are collaborating with the BBC’s Science Unit, BBC Radio 4 and the University of Salford to study the public’s attitudes to synthetic voices.' />
			<meta property='og:site_name' content='BBC R&D' />
			<meta property='og:title' content='BBC R&D Synthetic Voice and Personality Study' />
			<meta property='og:description' content='BBC Research & Development are collaborating with the BBC’s Science Unit, BBC Radio 4 and the University of Salford to study the public’s attitudes to synthetic voices.' />
		</Head>
		<main className={articleClass ? `article ${articleClass}` : ''}>
			<Component {...pageProps} />
		</main>
	</>
}
