import { useState, useEffect } from 'react'

function getSize (isClient) {
	return {
		width: isClient ? window.innerWidth : undefined,
		height: isClient ? window.innerHeight : undefined
	}
}

function useWindowSize () {
	const isClient = typeof window === 'object'

	const [windowSize, setWindowSize] = useState(getSize)

	useEffect(() => {
		const handleResize = () => setWindowSize(getSize(isClient))

		handleResize()
		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [isClient])

	return windowSize
}

export default useWindowSize
