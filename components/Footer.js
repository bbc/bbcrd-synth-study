const Footer = () => {
	return <footer>
		<div className='col-wrapper'><img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/logo.svg`} alt='made by BBC R&D' /></div>
	</footer>
}

export default Footer
