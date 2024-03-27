/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-interactive-element-to-noninteractive-role */
import Footer from '@/components/Footer'
import useVisibility from '@/components/useVisibility'
import AudioPlayer from '@/components/AudioPlayer'
import SectionDivider from '@/components/SectionDivider'
import Head from 'next/head'
import Link from 'next/link'
import { useRef } from 'react'

const DesigningInterfacesToAuditionVoices = () => {
	const toc = [
		{ type: 'section', link: 'questions', title: 'Research Questions', ref: useRef() },
		{ type: 'subsection', link: 'framing', title: 'Framing the study', ref: useRef() },
		{ type: 'section', link: 'crafting-the-experience', title: 'Crafting the Interface', ref: useRef() },
		{ type: 'subsection', link: 'enjoyable', title: 'An Enjoyable Experience', ref: useRef() },
		{ type: 'subsection', link: 'reducing-bias', title: 'Reducing Bias', ref: useRef() },
		{ type: 'subsection', link: 'satisfying', title: 'A Satisfying experience', ref: useRef() },
		{ type: 'section', link: 'shortcomings-opportunities', title: 'Shortcomings & Opportunities', ref: useRef() },
		{ type: 'subsection', link: 'manually-crafting', title: 'Manually Tweaking Pronunciation', ref: useRef() },
		{ type: 'subsection', link: 'changes', title: 'Changes Since Release', ref: useRef() }
	]

	const lastVisible = useVisibility(toc)

	return (
		<>
			<div className='article-page'>
				<div className='article-chunk intro'>
					<div className='article-details'>
						<div className='article-number two'>3</div>
					</div>
					<div className='article-content'>
						<div className='credit'>
							<time>August 2020</time>
							<div className='authors'>Mathieu Triay & Andrew Wood</div>
						</div>
						<div className='standout-intro'>
							<AudioPlayer file='articles/intro.mp3' />
							<p>
								This series of three articles presents the steps we took to build 24 synthetic voices with accents that broadly cover the UK nations and regions.<br />
								<Link href='/' legacyBehavior><a className='cta'>All articles <span className='arrow'>→</span></a></Link>
							</p>
							<div className='pattern part-three' />
						</div>
					</div>
				</div>
				<div className='article-chunk'>
					<Head>
						<title>BBC R&D Synthetic Voice and Personality Study — Part Three</title>
					</Head>

					<div className='toc-wrapper'>
						<h1>Designing Interfaces to Audition Voices</h1>

						<ul className='toc'>
							{
								toc.map(({ type, link, title }, i) => {
									return <li key={link} className={`${type} ${lastVisible === i ? 'visible' : ''}`}><a href={`#${link}`}>{title}</a></li>
								})
							}
						</ul>
					</div>

					<div className='article-content'>
						<section>
							<p>In 2020, <a target='_blank' rel='noopener noreferrer' href='https://www.bbc.co.uk/rd'>BBC R&D</a> launched an online study looking at voice assistants and regional accents. For this study we produced 24 synthetic voices broadly covering the UK nations and regions. This series of articles details the challenges we faced and the choices we made along the way.</p>

							<p>Read <Link href='/creating-synthetic-voices-at-scale'>Part One</Link> to learn how we built a phonetically balanced corpus of text and <Link href='/fast-voice-prototyping-with-model-fine-tuning'>Part Two</Link> to see how we used machine learning to generate voices using that corpus.</p>

							<figure className='no-multiply'>
								<img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/articles/regions.png`} alt='List of the divisions of the UK we used in the study' />
								<figcaption>List of the divisions of the UK we used in the study</figcaption>
							</figure>

							<p>We recorded and processed over 30 different voices to choose 24 that would be a representative — albeit broad — sample of the UK. We divided the country into 13 sections, and looked to get a male and female voice for each. We made good quality synthetic versions of them so we could answer questions about the public’s perceptions of accents and gender in artificial voices.</p>

							<p>This article is an overview of the research process, from defining the research questions to crafting an interface that would be easy and engaging to use. We also discuss some of the shortcomings of that design and some of the changes we’ve either made or would like to make in the future.</p>
						</section>
						<section>
							<SectionDivider {...toc[0]} />

							<p>This is not the first time we’ve looked at voice-driven interactions at BBC R&D. We have an ongoing project called <a target='_blank' rel='noopener noreferrer' href='https://www.bbc.co.uk/rd/projects/talking-with-machines'><i>Talking with Machines</i></a> which gave birth to the popular <a target='_blank' rel='noopener noreferrer' href='https://www.bbc.co.uk/taster/pilots/inspection-chamber'><i>Inspection Chamber</i></a> as well as the adaptation of the audio drama <a target='_blank' rel='noopener noreferrer' href='https://www.bbc.co.uk/rd/blog/2018-11-unfortunates-skill-alexa-story-drama-johnson'><i>The Unfortunates</i></a>. We collated our learnings from these projects in a white paper called <a target='_blank' rel='noopener noreferrer' href='https://www.bbc.co.uk/rd/publications/top-tips-for-designing-voice-applications'><i>Top Tips for Designing Voice Applications</i></a>. Since then, we’ve undertaken <a target='_blank' rel='noopener noreferrer' href='https://www.bbc.co.uk/rd/topics/voice-interfaces'>many more projects</a> including explorations around emotional machines and navigation for voice devices.</p>

							<SectionDivider {...toc[1]} />
							<p>For this piece of work, however, we’re looking beyond the capabilities of these devices and into what makes them tick. With the rise of voice assistants, the audience has grown from aficionados to a wide and diverse public. And maybe because of this spectacular increase in users, the interface to this technology is still very much in the same place it was when it was introduced: a single voice. Yes, you have different voices for different languages, the range of queries they can answer is wider, and they understand you a bit better (<a target='_blank' rel='noopener noreferrer' href='https://venturebeat.com/2020/06/17/research-shows-non-native-english-speakers-struggle-with-voice-assistants/'>but not always</a>). Nevertheless, these devices sit in our personal space — living rooms, kitchens and bedrooms — but remain impersonal. They often struggle with accents, particularly if you’re not a native speaker or have a very strong accent. And maybe worse, they sound the same wherever you live in the country.</p>

							<p>Accent is tied to identity and it is possible that we make conscious and subconscious associations with it. It’s a key tool of communication, but also drama, comedy, and interaction in general. There are accents that we find easier to understand, or that represent a certain tone or style in the collective mind. No doubt this is very dependent on where you grew up and where you live. Additionally, the notion of synthetic voices might play a role in modulating these reactions. Would you trust a synthetic voice as much as a real human voice? Perhaps, much like vinyl records, people find a warmth in human voices that's absent from their artificial counterparts, which until recently tended to have a distinctly robotic sound. If so, what’s missing? When is it needed, and when can we do away with it safely? How faithful should these voices be? Is the risk of stepping into the <a target='_blank' rel='noopener noreferrer' href='https://en.wikipedia.org/wiki/Uncanny_valley'>uncanny valley</a> too great?</p>

							<p>A lot of questions start to pop up and we designed this study in order to address some of them. Specifically, do people have preferences for synthetic voices that come from their region? And if so, in what context? Voice devices are used for a multitude of things, from news to entertainment through to music and timers. Should there be a difference between news and local news, matching what’s easily found on the radio? There’s also a branding effect to take into account. The commercial companies that choose to propose a restricted set of voices might also do so because it helps enforce an idea of the brand. Gender is also an important component as a lot of voice assistants default to female voices. Would women prefer male voices? Would men too? And perhaps most importantly, have female voices been the default for so long that it affects the choice of existing users?.</p>

							<p>With these questions in mind, the interface would need to present different sample utterances for different contexts. That would be 24 samples to audition and choose from for each context, not counting the additional questions around it. Completing a study can already be an effort so we wanted to make this as quick and enjoyable as possible. </p>
						</section>
						<section>
							<SectionDivider {...toc[2]} />

							<p>We chose to investigate three contexts where we thought accent might change the perception of what’s being said and the quality of the interaction: news, local news and the voice of the device itself.</p>

							<figure className='no-multiply'>
								<img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/articles/voice-options.png`} alt='The three contexts for the Study participants’ consideration' />
								<figcaption>The three contexts for the Study participants’ consideration</figcaption>
							</figure>

							<p>For national news, someone might prefer a voice they perceive as neutral, serious or authoritative. Does that change across the country? Does the fact that most news is currently delivered in the so-called <a target='_blank' rel='noopener noreferrer' href='https://en.wikipedia.org/wiki/Received_Pronunciation'>Received Pronunciation accent (RP)</a> — strongly associated with the South East of England — play a part in what the public perceive as “default”?</p>

							<p>By nature, local news is often delivered in the local accent. Should that be replicated in that context, or is it perceived without distinction from the national news?</p>

							<p>As for the device voice, it’s an opportunity to choose a voice that you might want to hear in your home on a daily basis. Does that mean matching the local accent? Does that mean using an accent perceived as friendly? And how does that change from region to region?</p>

							<p>To make these distinctions clear to the user, the participants are asked to choose a voice for each of these contexts in order. That way they get to experience a range of voices. Placing news first gives them an opportunity to choose something different for the other contexts if they feel like it.</p>

							<SectionDivider {...toc[3]} />

							<p>We wanted participants to be able to choose the same voice throughout, in case they preferred a uniform voice. However, to avoid introducing any bias we couldn’t label the voices; we wanted the participants to choose a voice based on what it sounded like and not its name or associated region. Answering the questions might take too long if the 24 sampled voices were randomised for every context. It would ensure each selection was meaningful, but it would also be lengthy and reduce our chances of having complete answers for each participant.</p>

							<p>Thus, to make the task more palatable, we reduced the number of accents to audition from 12 to 5. However, we couldn’t do this randomly. Firstly, each participant should have a stable set to audition so that they’re able to find the same accent throughout the study. Secondly, we needed to present them with both their local accent (if they self-declared as native British English speakers) and the RP set. The three other accents could be random and act as a control. For each accent we had a male/female pair to show: a total of 10 samples per context in total.</p>

							<SectionDivider {...toc[4]} />

							<p>By reducing the number of samples, we hopefully reduce the cognitive load linked to tracking which voice the user liked. Additionally, though the grid appeared blank, we made sure to include a “visited” state so listening to the same sample twice would be intentional. The male/female pairs are stacked vertically — which one is on top is randomised each time so as not to give preference to either — and the different accents are placed horizontally.</p>

							<figure><img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/articles/voice-grid.png`} alt='Randomised grid of voices with different states' /><figcaption>Randomised grid of voices with different states</figcaption></figure>

							<p>Another aspect we had to mitigate was the quality of the voices. Despite our best efforts, some of the processed voices sound better than others, but we didn’t want the quality to influence participants’ choices. Even though the participants are instructed to disregard quality for that part of the study, we had to minimise the bias it could introduce. So we made sure to display the written version of what the voice says in a prominent position, hoping it would reduce problems linked to understanding what the voice is supposed to say. Later in the study, we also ask the user to rate a voice based on its quality and to select from which part of the country they think it originates. This allows us to observe if quality is indeed a factor, and if the accent can be accurately located.</p>

							<figure className='no-multiply'><img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/articles/choose-a-voice.png`} alt='The complete question interface' /><figcaption>The complete question interface</figcaption></figure>

							<SectionDivider {...toc[5]} />

							<p>As much as possible, the study takes the participant on a journey. From telling us about themselves to auditioning voices in different contexts and rating them. And even though the overall time to complete the study is short enough, we think that increasing the sense of place and progress helps to keep it engaging. To make their participation more meaningful, we also wanted something for them to take away at the end: we show them what a typical interaction with this imaginary device might sound like with the accents they’ve selected, revealing the name of the region or nation it comes from.</p>
						</section>
						<section>
							<SectionDivider {...toc[6]} />

							<p>To create that journey, we worked closely with our copywriter to decide on the short sentences our voices should read aloud. From testing we found that a short sentence of around five seconds of audio was most effective, given the total number of samples for auditioning and the average response length from existing voice assistants. We trialled different utterances for each accent, hoping that creating some diversity in what you’d be listening to would make it less monotonous but that would have been an additional variable to take into account in our analysis. Instead, we opted for the same sentence per context, meaning that local news had to feel localised without specific geographical context and national news needed more gravitas and wide appeal.</p>

							<SectionDivider {...toc[7]} />
							<p>You can read more technical detail of creating the voices in <Link href='/'>Part Two of this article series</Link>. In addition to that process, actually synthesising a string of text into an audio version required some further steps. Occasionally, the generated voice would mispronounce words and contain strange cadences or even gobbledygook. This meant we had to create alternative spellings of each sentence per model, re-editing the text with phonetically spelt words until it sounded optimal for that voice and accent. We did this on top of an audio treatment levelling the loudness and smoothing out the sibilance. This was important because all voices needed to have the same level of audible quality to avoid introducing the quality bias discussed earlier.</p>

							<SectionDivider {...toc[8]} />
							<p>In an earlier version, the participants were also asked to label their chosen voice with one adjective (Familiar / Friendly / Trustworthy / etc.), with the option to write their own if they felt the need. All of the options were different positive aspects the voice could have. We hoped this would provide insight into the association of particular accents with particular adjectives. With the involvement of Ewan Nicolson from the <a target='_blank' rel='noopener noreferrer' href='https://datalab.rocks/'>BBC’s Datalab</a>, we decided to remove this step to maintain the focus on our main question: do people prefer local voices for certain context? Adding a step to that question could detract from the answer and create unnecessary noise as well as making the study longer to complete.</p>

							<figure className='no-multiply'><img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/articles/adjective-question.png`} alt='Additional question we removed' /><figcaption>The additional interface that we later removed</figcaption></figure>

							<p>Since we’re interested in the perceived trustworthiness of synthetic voices, though, we needed a way to capture this feedback. Here we added a single question focused on that point, specifically asking the participant to choose which voice they think sounds the most trustworthy.</p>

							<p>In designing a study that would tackle the many complex and intertwined aspects of synthetic voices, from gender to contextualised accents, we accumulated a large number of parameters, which in turn require a large number of participants in order to gather sufficient insight, particularly around regionality. For that reason, we’re leaving the study online until we’ve acquired sufficient data to draw confident insight that we’ll report on in a future article.</p>
						</section>

						<Link href='/' legacyBehavior><a className='cta'>All articles <span className='arrow'>→</span></a></Link><br />
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default DesigningInterfacesToAuditionVoices
