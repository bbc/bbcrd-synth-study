/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-interactive-element-to-noninteractive-role */
import Footer from '@/components/Footer'
import Link from 'next/link'
import Head from 'next/head'

const ArticleLink = ({ imageUrl, href, title, description }) => {
	const block = <a className='article-link'>
		<div className='illustration' style={{ backgroundImage: `url('${imageUrl}')` }} />
		<div className='content'>
			<h2>{title}</h2>
			<div className='description'>
				<p>{description}</p>
				<p className='next-button'>Read more</p>
			</div>
		</div>
	</a>

	return <Link href={href} legacyBehavior>{block}</Link>
}

const Index = () => {
	return (
		<div className='article-index-page'>
			<Head>
				<title>BBC R&D Synthetic Voice and Personality Study — Creating Synthetic Voices With Regional Accents</title>
			</Head>

			<div className='col-wrapper'>
				<h1 className='indented'>Creating Synthetic Voices with Regional Accents</h1>
				<div className='intro-block'>
					<p className='intro'>This series of articles details the decisions made and challenges faced while developing synthetic voices with regional accents for a study conducted in 2020.</p>
				</div>

				<ArticleLink
					imageUrl={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/part-one-red.png`}
					href='/creating-synthetic-voices-at-scale'
					title='Creating Synthetic Voices at Scale'
					description='Learn about the need for synthetic voices with accents, and our method to create them quickly and cheaply.'
				/>
				<ArticleLink
					imageUrl={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/part-two-red.png`}
					href='/fast-voice-prototyping-with-model-fine-tuning'
					title='Fast Voice Prototyping with Model Fine-Tuning'
					description='A deep dive into the machine learning approach employed to produce and improve our synthetic voices.'
				/>
				<ArticleLink
					imageUrl={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/part-three-red.png`}
					href='/designing-interfaces-to-audition-voices'
					title='Designing Interfaces to Audition Voices'
					description='The challenges of designing an interface that reduces potential selection bias, while making the experience enjoyable.'
				/>
			</div>

			<Footer />
		</div>
	)
}

export default Index
