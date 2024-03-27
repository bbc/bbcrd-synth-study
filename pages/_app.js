import '@/styles/globals.css'
import { useRouter } from 'next/router'

export default function App ({ Component, pageProps }) {
	const router = useRouter()
	const articleClass = router.pathname.split('/').pop()

	return <main className={articleClass ? `article ${articleClass}` : ''}>
		<Component {...pageProps} />
	</main>
}
