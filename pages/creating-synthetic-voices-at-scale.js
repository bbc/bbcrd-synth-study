/* eslint-disable jsx-a11y/iframe-has-title */
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

const CreatingSyntheticVoicesAtScale = () => {
	const toc = [
		{ type: 'section', link: 'synth-voice-tech', title: 'Synthetic Voice Technology', ref: useRef() },
		{ type: 'subsection', link: 'fast-cloning', title: 'Fast Voice Cloning Techniques', ref: useRef() },
		{ type: 'subsection', link: 'fine-tuning', title: 'Fine-Tuning Existing Models', ref: useRef() },
		{ type: 'section', link: 'building-dataset', title: 'Building a Dataset', ref: useRef() },
		{ type: 'subsection', link: 'balancing', title: 'Phonetical Balancing', ref: useRef() },
		{ type: 'subsection', link: 'subtitles', title: 'Using Subtitles', ref: useRef() },
		{ type: 'section', link: 'recording-voices', title: 'Recording Voices', ref: useRef() },
		{ type: 'subsection', link: 'method-scale', title: 'Recording at scale', ref: useRef() },
		{ type: 'subsection', link: 'post-processing', title: 'Post-processing', ref: useRef() }
	]

	const lastVisible = useVisibility(toc)

	return (
		<>
			<div className='article-page'>
				<div className='article-chunk intro'>
					<div className='article-details'>
						<div className='article-number'>1</div>
					</div>
					<div className='article-content'>
						<div className='credit'>
							<time>August 2020</time>
							<div className='authors'>Mathieu Triay & Alexandros Triantafyllidis</div>
						</div>
						<div className='standout-intro'>
							<AudioPlayer file='articles/intro.mp3' />
							<p>
								This series of three articles presents the steps we took to build 24 synthetic voices with accents that broadly cover the UK nations and regions.<br />
								<Link href='/' legacyBehavior><a className='cta'>All articles <span className='arrow'>→</span></a></Link>
							</p>
							<div className='pattern part-one' />
						</div>
					</div>
				</div>
				<div className='article-chunk'>
					<Head>
						<title>BBC R&D Synthetic Voice and Personality Study — Part One</title>
					</Head>

					<div className='toc-wrapper'>
						<h1>Creating Synthetic Voices at Scale</h1>

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
							<p>In 2020, <a target='_blank' rel='noopener noreferrer' href='https://www.bbc.co.uk/rd'>BBC R&D</a> launched an online study looking at voice assistants and regional accents. By and large, voice assistants such as Siri or Alexa are uniform at language level. They exist in two variants, male and female – the default. You have a French Siri and a British Siri, an American one and an Italian one. These devices sit in our homes, in our living rooms and kitchens expecting we speak to them naturally. People across the world speak to them in a multitude of accents and twangs and yet, these assistants reply uniformly with the same tone and accent for everyone in every situation. There’s no personalisation in the most personal space: your home.</p>

							<figure><img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/devices.svg`} alt='A home scene with voice-enabled devices' /></figure>

							<p>In this series of three articles, we’ll present the steps we took to build 24 synthetic voices with accents that broadly cover the UK nations and regions. Here, we’ll endeavour to give detailed explanations of the methods used and you can head to our <a target='_blank' rel='noopener noreferrer' href='https://github.com/bbc/bbcrd-synth-study'>Github repository</a> to find a more technical walkthrough. Continue reading to understand the challenges we faced and the choices we made to overcome them.</p>

							<p>The study focuses on the public’s perception of synthetic voices and how this is affected by accents. Would you want a device to speak with your local accent? Should it have the same voice for every type of task or content? How do people perceive these different accents and what does it mean to them? Does the fact it comes from a synthetic voice and not a real person change how it is received?</p>

							<p>To answer these questions, we needed an array of voices that would cover the regions of the United Kingdom, with a male and female counterpart for each of them. We discussed at length the possibility of a gender spectrum, including gender neutral voices, but thought that would benefit from a separate study altogether. These voices needed to sound good enough that their quality wouldn’t be too great a factor in the participant’s choice, but they didn’t need to be completely lifelike either; we’re primarily interested in the choice of accent rather than achieving best-in-class artificial voices. The participants would know upfront that these were computer-generated samples, so we didn’t need to disguise them as long as they didn’t sound too robotic.</p>

							<p>Commercially-available solutions follow a similar pattern to what you’ll find on an assistant: a couple of voices per language, sometimes more. There are a few providers that will offer a scattered spread across a country, but they hardly cover the UK. And even though, to our knowledge, this is the first time a study of this scale has been undertaken with synthetic voices, we knew we’d have to paint with broad strokes, because the regionality of accents gets incredibly granular (estimates range from about 40 to thousands!). It became clear that our requirement of at least two voices per nation or region meant that we’d have to produce these voices ourselves. This article focuses on how we chose the best technology for our requirements and the steps we took to build a corpus of text to record.</p>
						</section>

						<section>
							<SectionDivider {...toc[0]} ref={toc[0].ref} />

							<div className='with-sidenote'>
								<p>At the time of our research, the state of the art in synthetic voices was probably a package known as <a target='_blank' rel='noopener noreferrer' href='https://google.github.io/tacotron/publications/tacotron2/index.html'>Tacotron 2</a>, coming from research at Google. This uses a set of neural networks that learn to match pieces of text to the corresponding audio. As a result, audio can be generated from arbitrary text input.</p>

								<figure className='audio'>
									<AudioPlayer file='articles/peterpiper.wav' />
									<figcaption>A tongue twister delivered confidently by Tacotron 2</figcaption>
								</figure>
							</div>

							<p>This is a time-consuming and expensive process. First you need a dataset — lengthy recordings from a single voice, often over 24 hours. Then, you need to train the neural network. The total time varies of course, but each complete training is likely to cost well over £500 on cloud-based systems such as AWS. In our testing, using public domain datasets, the results were more than satisfactory. However, these requirements are such that recording 24 voices for 24 hours each, totalling thousands of pounds, was impossible at worst and impractical at best.</p>

							<SectionDivider {...toc[1]} ref={toc[1].ref} />
							<p>Alternatively, there are packages that offer <a target='_blank' rel='noopener noreferrer' href='https://github.com/CorentinJ/Real-Time-Voice-Cloning'>real-time voice cloning</a> with minimal sections of audio. The process is almost instantaneous and a recording of a few seconds will get you an impressive output for the amount of time spent. When it came to trialling this method we realised that much of the accent was stripped away. It kept a certain tone and was relatively recognisable as the person upon whose recording it was based, but we were losing the one thing we were after for our study.</p>

							<figure>
								<div className='embed-container'><iframe src='https://www.youtube-nocookie.com/embed/-O_hYhToKoA' frameBorder='0' allowFullScreen /></div>
								<figcaption>SV2TTS demo with sample audio</figcaption>
							</figure>

							<p>The reason this method is so much faster than Tacotron (parts of which are used under the hood) is that it doesn’t need to be trained from scratch every time. Once you have a very well trained voice model, one created with a large dataset, it gives you the foundations to create another voice. The idea is that much of speech is common and you just need to tweak it for each person based on what makes their voice sound unique. So you extract that fingerprint — called “embedding” — from a very short sample and you tune the base model to reflect the differences.</p>

							<figure><img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/articles/sv2tts.png`} alt='A very high level diagram of how SV2TTS works' /><figcaption>A very high level diagram of how SV2TTS works</figcaption></figure>

							<p>A few seconds of audio might be good enough to copy the timbre of a voice, but it’s not enough to capture someone’s accent so we couldn’t really expect that to perform well for our task. However, the core idea of reusing a base model and tuning it could still apply if we had a more extensive — but still short — dataset for each of the accents. Instead of extracting an embedding, we could train directly on top of the base voice. Doing this with Tacotron, because of its recurrent neural network architecture, would still mean long and expensive training times for a voice quality we didn’t require.</p>

							<SectionDivider {...toc[2]} ref={toc[2].ref} />
							<p>With this in mind, we tried another architecture for text-to-speech voice generation that uses <a target='_blank' rel='noopener noreferrer' href='https://arxiv.org/abs/1710.08969'>deep convolutional neural networks</a>. Because there are no recurrent units in the network, it can be trained more quickly and cheaply. The examples provided on the various available packages convinced us that the output quality was suitable. Using the public domain <a target='_blank' rel='noopener noreferrer' href='https://keithito.com/LJ-Speech-Dataset/'>LJ speech dataset</a> we trained a base model that we could tune by continuing the training but with a regional dataset instead.</p>

							<figure><img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/articles/model-tuning.png`} alt='A very high level diagram of our solution' /><figcaption>A very high level diagram of our solution</figcaption></figure>

							<div className='with-sidenote'>
								<p>The LJ dataset is a single person reading public domain audio books from <a target='_blank' rel='noopener noreferrer' href='http://www.gutenberg.org/'>Project Gutenberg</a>. In the same spirit, we recorded 1.5 hours of one of our colleagues from Yorkshire reading another public domain book. Lo and behold, the results were astounding. With less than £25 worth of computing time, we cloned the voice of one of our colleagues with an uncanny quality and his accent pretty much intact.</p>

								<figure className='audio'>
									<AudioPlayer file='articles/woodchuck.wav' />
									<figcaption>One of the first sample utterances we generated with this new method</figcaption>
								</figure>
							</div>

							<p>Naturally, the results were still far from what state of the art text-to-speech can do, but they were already far superior to a lot of what we heard, even from some commercial offerings. More importantly, they ticked our boxes: it’s quick, it’s cheap, it sounds good and we only need a couple of hours of someone’s speech to create a model. Suddenly, making 24 of them became a lot more realistic.</p>
						</section>

						<section>
							<SectionDivider {...toc[3]} ref={toc[3].ref} />

							<p>One of the issues we noticed with our first model is that some words sounded completely wrong, a little bit like when you try to say a word you’ve only ever read for the first time. Some combinations of letters would sound off, as if they were lacking context. It’s one of the limitations of the simpler system we’re using, but we thought it might also be heavily influenced by the dataset we fed the network.</p>

							<p>That dataset we used had a couple of problems:</p>

							<ul>
								<li>It was not phonetically balanced. It’s an arbitrary set of sentences, it doesn’t cover all the sounds of the English language and doesn’t cover them proportionally or evenly.</li>
								<li>It was the recording of someone reading a book out loud. Books, more often than not, are meant to be read in your head and not spoken. There’s a tendency to “perform” and the length of sentences, their shape, intonation and vocabulary aren’t what you’d find in a usual conversation.</li>
							</ul>

							<SectionDivider {...toc[4]} ref={toc[4].ref} />
							<p>Phonetically balancing a dataset means creating a source text for people to read that contains all the sounds of the English language in a proportional fashion. In practice, it means sounds like “th” as in “the” or “that” will appear more frequently than sounds like “th” as in “mouth”. And based on frequency and surrounding letters, the neural network will be better able to choose the correct sounds.</p>

							<p>At the time, we couldn’t find a freely available corpus of text that would satisfy these conditions. The closest is a set of sentences called <a target='_blank' rel='noopener noreferrer' href='https://en.wikipedia.org/wiki/Harvard_sentences'>the Harvard Sentences</a>. This is a small corpus which can be read in less than 30 minutes. The samples have been widely used to test synthetic voices because they use a challenging set of phonemes. They were used to <a target='_blank' rel='noopener noreferrer' href='https://gizmodo.com/the-harvard-sentences-secretly-shaped-the-development-1689793568'>test audio equipment and early phone systems</a> before that.</p>

							<p>That corpus is too short for our use and moreover doesn’t provide a proportional representation of phonemes. Additionally, these sentences have been composed specifically for their phonetic quality – it’s hard to deliver them in a conversational way.</p>

							<p>However, researchers in linguistics have set out ways to build such corpuses. We found such a method in a paper designed to build a corpus for Mexican Spanish called <a target='_blank' rel='noopener noreferrer' href='http://www.lrec-conf.org/proceedings/lrec2004/pdf/736.pdf'>VOXMEX</a>. Broadly, you choose two pairs of sounds — phonemes — from all the possible sounds, find two words containing a pair each, then manually create a sentence which contains them. There are approximately 44 phonemes in English, so that’s ~1900 possible combinations, meaning ~950 sentences.</p>

							<p>Once you’ve covered all combinations, you look at the phonetic distribution of your corpus and keep tweaking to get it to match a baseline distribution. Remove a “th” and add an “ee” and so on until you have a balanced corpus.</p>

							<figure><img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/articles/corpus-building-1.png`} alt='The process to build a sentence for a phonetically balanced corpus' /><figcaption>The process to build a sentence for a phonetically balanced corpus</figcaption></figure>

							<p>This is a pretty lengthy task and creating over 900 sentences manually seemed too hard, particularly if we wanted them to sound conversational. Moreover, we still needed a baseline to compare against. In some papers, including VOXMEX, they use a standard dictionary to estimate the distribution of phonemes. However, dictionaries contain words that are rarely used and words that are used multiple times in a paragraph. To find the actual distribution of phonemes, we’d need access to do the same task on large amount of speech.</p>

							<SectionDivider {...toc[5]} ref={toc[5].ref} />
							<p>Fortunately, the BBC has subtitles for the majority of its broadcasts in English. Subtitles reflect what’s spoken on screen by actors, so we suspected that they would have more of the conversational qualities we were after. The subtitles dump we had access to contained hundreds of thousands of subtitles, amounting to 5Gb worth of text. All we had to do was write a script to clean them and reassemble broken parts into whole sentences, rejecting everything else: music, sound effects, exclamations, etc.</p>

							<figure><img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/articles/phoneme-distrib.png`} alt='Comparing the distribution of subtitles vs dictionary vs Harvard Sentences' /><figcaption>Comparing the distribution of subtitles vs dictionary vs Harvard Sentences</figcaption></figure>

							<p>BBC R&D also works on speech-to-text and for that purpose has access to some very extensive dictionaries which accompany words with their phonetic pronunciation. Additionally, we used a British dictionary, meaning that we’d cover British English more accurately. Having all these sentences transcribed into phonemes, we got two things:</p>

							<ul>
								<li>A baseline representation of English phonemes. It’s safe to assume that with this quantity of text we covered all useful combinations of sounds.</li>
								<li>A list of sentences we could search and pull for their phonetic qualities. Instead of manually constructing sentences, we could use sentences directly from the subtitles. They contain naturally occurring words from a representative corpus and we could assume they would be easy to say since they’ve been said on screen already.</li>
							</ul>

							<figure><img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/articles/corpus-building-2.png`} alt='Our corpus building method using subtitles' /><figcaption>Our corpus building method using subtitles</figcaption></figure>

							<p>Following a very similar method, we could get a list of all phonemes and pull sentences which had two specific combinations each. Together with these, they’d bring a whole other bag of sounds, which is useful because we need to both bulk up the text (we need it to be ~2hrs) and we need to maintain a proportional representation. And since we’re randomly choosing sentences with a simple enough criteria, we end up with a very small but representative subset of the complete subtitles. As a result, that corpus is just as phonetically balanced as the source and we can generate many different ones.</p>

							<p>Download an example corpus on our <a target='_blank' rel='noopener noreferrer' href='https://github.com/bbc/bbcrd-synth-study'>Github repository</a>.</p>

							<figure><img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/articles/corpus-subtitles-correlation.png`} alt='This is the distribution of Subtitles vs the new phonetically balanced corpus (99.9% correlation)' /><figcaption>This is the distribution of subtitles vs the new phonetically balanced corpus (99.9% correlation)</figcaption></figure>

						</section>

						<section>
							<SectionDivider {...toc[6]} ref={toc[6].ref} />

							<p>The newly generated corpus in hand, we got the same colleague to record it and we trained it using the deep convolutional model tuning method. There was a noticeable improvement, both in quality and pronunciation. It still stumbled on some words but ultimately, the result was good enough for the purpose of our study.</p>

							<p>Getting 24 people to record it is a little more complicated. First, if you’ve tried recording yourself reading anything out loud, you know that you make mistakes. You need to start sentences over a lot. And if you’re going to read over 1000 sentences, that’s a lot of mistakes. The voices we managed to source to represent the various UK nations and regions were half from professional actors and half from colleagues around the BBC. With such a variety of skill we needed to create a process which would make recording easier than stopping and restarting all the time.</p>

							<SectionDivider {...toc[7]} ref={toc[7].ref} />
							<p>Instead, we chose to let the tape roll and keep recording. We asked the recording artists to use a manual clicker every time they needed to start over. That would create a noticeable enough peak in the recording that we could split things up easily. Still, for ~2 hours of audio, you may get a total of 4 hours, mistakes included. That’s a lot to clean up.</p>

							<p>Instead, we leveraged another piece of technology developed by BBC R&D for its speech-to-text system called an aligner. The aligner matches a piece of audio, by first getting a speech-to-text transcription of it, to a given text. Since what we’re recording is a definitive corpus and we need the recording to match exactly, we can use the aligner to identify the sections which had complete sentences and extract those.</p>

							<p>Another way to do this is to use <a target='_blank' rel='noopener noreferrer' href='https://github.com/bbc/bbcrd-synth-study/tree/master/dataset#3-record'>this script</a>. It presents a sentence to you to record. If you make a mistake, you hit a key and you can try again. When you’ve got it, you can hit another key and get to the next sentence. That’s a bit more work for the recording artist (and you might accidentally record the keys being pressed) but it doesn’t require some additional technology to make sense of the recording.</p>

							<SectionDivider {...toc[8]} ref={toc[8].ref} />
							<p>The result is over 1000 audio files with a sentence each. But people (and machines) are fallible. They pause in the middle of a sentence, and machines cut the sentence a little too long and leave some silence at either end. We noticed the neural network would sometimes get confused by the pauses, resulting in garbled output. Same thing for commas, semicolons, and pauses enforced by semantic structures. So while we made sure to strip that from the corpus as much as possible, we also wrote a script that shortened pauses and trimmed the audio files so they would have a more confident delivery.</p>

							<div className='side-by-side'>
								<figure className='audio'>
									<AudioPlayer file='articles/andrew.wav' />
									<figcaption>Human voice with pauses and silences</figcaption>
								</figure>

								<figure className='audio'>
									<AudioPlayer file='articles/andrew%20%281%29.wav' />
									<figcaption>Human voice processed to shorten silences</figcaption>
								</figure>
							</div>

							<p>With the list of audio files and the corpus we could now create a dataset which was phonetically balanced and compatible with the format used in the LJ dataset. The next article in the series will detail the method used to train the neural network, selecting the best models and the post-processing tricks we used to clean up the audio output. If you’re eager to dive in, head over to <a target='_blank' rel='noopener noreferrer' href='https://github.com/bbc/bbcrd-synth-study'>our repository</a> which contains an extensive README covering the different parts from a technical point of view.</p>
						</section>
						<Link href='/' legacyBehavior><a className='cta'>All articles <span className='arrow'>→</span></a></Link><br />
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default CreatingSyntheticVoicesAtScale
