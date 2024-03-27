import { forwardRef } from 'react'

// eslint-disable-next-line react/display-name
const SectionDivider = forwardRef(({ type, link, title }, ref) => {
	if (type === 'section') {
		return <h2 ref={ref} id={link}>{title}</h2>
	}
	else {
		return <h3 ref={ref} id={link}>{title}</h3>
	}
})

export default SectionDivider
