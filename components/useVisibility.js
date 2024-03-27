import { useState, useEffect } from 'react'
import useWindowSize from './useWindowSize'

function useVisibility (toc) {
	const [lastVisible, setLastVisible] = useState(0)
	const { height } = useWindowSize()

	useEffect(() => {
		const checkVisible = () => {
			const visibility = toc.map((el) => {
				const bounds = el.ref.current.getBoundingClientRect()

				return bounds.top < height * 0.5
			}).filter((visible) => visible)

			if (lastVisible !== visibility.length - 1) {
				setLastVisible(visibility.length - 1)
			}
		}

		window.addEventListener('scroll', checkVisible)
		checkVisible()

		return () => window.removeEventListener('scroll', checkVisible)
	}, [height, toc, lastVisible])

	return lastVisible
}

export default useVisibility
