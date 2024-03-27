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

const FastVoicePrototypingWithModelFineTuning = () => {
	const toc = [
		{ type: 'section', link: 'architecture', title: 'The Architecture', ref: useRef() },
		{ type: 'subsection', link: 'guided-attention', title: 'Guided Attention', ref: useRef() },
		{ type: 'section', link: 'synthesising-text', title: 'Synthesising Text', ref: useRef() },
		{ type: 'subsection', link: 'pronunciation', title: 'Explicit Pronunciation', ref: useRef() },
		{ type: 'subsection', link: 'punctuation-pauses', title: 'Punctuation & Pauses', ref: useRef() },
		{ type: 'subsection', link: 'post-processing', title: 'Post-Processing', ref: useRef() },
		{ type: 'section', link: 'future-work', title: 'Future Work', ref: useRef() },
		{ type: 'subsection', link: 'pronunciation-flow', title: 'Improved Pronunciation & Flow', ref: useRef() },
		{ type: 'subsection', link: 'new-arch', title: 'New Architecture & Training', ref: useRef() }
	]

	const lastVisible = useVisibility(toc)

	return (
		<>
			<div className='article-page'>
				<div className='article-chunk intro'>
					<div className='article-details'>
						<div className='article-number two'>2</div>
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
							<div className='pattern part-two' />
						</div>
					</div>
				</div>
				<div className='article-chunk'>
					<Head>
						<title>BBC R&D Synthetic Voice and Personality Study — Part Two</title>
					</Head>

					<div className='toc-wrapper'>
						<h1>Fast Voice Prototyping with Model Fine-Tuning</h1>

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
							<p>In 2020, <a target='_blank' rel='noopener noreferrer' href='https://www.bbc.co.uk/rd'>BBC R&D</a> launched an online study looking at voice assistants and regional accents. For this study, we produced 24 synthetic voices broadly covering the UK nations and regions. This series of articles details the technical challenges we faced and the choices we made to overcome them.</p>

							<p>Read <Link href='/creating-synthetic-voices-at-scale'>Part One</Link> to learn how we built a custom corpus of text to clone a voice efficiently or you can head over to our <a target='_blank' rel='noopener noreferrer' href='https://github.com/bbc/bbcrd-synth-study'>Github repository</a> for a technical walkthrough.</p>

							<p>Between the high quality but expensive and time-consuming <a rel='noopener noreferrer' target='_blank' href='https://arxiv.org/abs/1712.05884'>Tacotron&nbsp;2</a> and the cheap and quick but lossy <a rel='noopener noreferrer' target='_blank' href='https://arxiv.org/pdf/1806.04558.pdf'>SV2TTS</a> method, we found a middle ground. We combined the reuse of a base model from SV2TTS and a faster method for <a rel='noopener noreferrer' target='_blank' href='https://arxiv.org/abs/1710.08969'>text-to-speech using deep convolutional neural networks</a> to create a solution that’s both faster and cheaper to train and only requires a couple of hours of audio from a specially-crafted, phonetically-balanced dataset.</p>

							<p>This article is an overview of the architecture of the neural network, along with the work done on synthesising and post-processing the voices. We also discuss the shortcomings of this technique as well as possible improvements and future work.</p>
						</section>

						<section>
							<SectionDivider {...toc[0]} />

							<p>There are a couple of open-source implementations of the deep convolutional neural network approach but we chose to start from a Python implementation using <a rel='noopener noreferrer' target='_blank' href='https://www.tensorflow.org/'>Tensorflow</a>, called <a rel='noopener noreferrer' target='_blank' href='https://github.com/Kyubyong/dc_tts'>dc_tts</a>. This method, much like Tacotron, compares the text to the spectral representation of the matching audio. The system doesn’t directly generate audio, it first learns what the words “look like” in spectral space. In fact, it uses two independent networks that can be trained in parallel:</p>

							<ul>
								<li>The Text2Mel network which takes text as input and generates a coarse audio spectrogram (a sort of waveform but for frequencies).</li>
								<li>The Spectrogram Super-Resolution Network (SSRN). This takes the coarse spectrogram and upscales it into a full, high resolution, spectrogram. With the outputted high resolution spectrogram, we can generate a WAV audio file algorithmically (no neural network needed).</li>
							</ul>

							<p>You can think of this as a low resolution picture that get upscaled. The first network generates a rough result. When it’s upscaled, the machine fills in the blanks — augmenting the resolution — using the second network which has learned how to enhance the image specifically for that voice.</p>

							<figure>
								<img src='/static/images/articles/simplified-model-tuning.png' alt='Simplified DC TTS architecture with model tuning' />
								<figcaption>Simplified DC TTS architecture with model tuning</figcaption>
							</figure>

							<SectionDivider {...toc[1]} />

							<p>The downside of not using recurrent units in the network is that it’s harder to get it to remember long sequences of causality. In practice, it has a short attention span and it may have forgotten the beginning of the sentence by the time it finishes it. However, we can help it by using something called guided attention. Essentially, the network is penalised when its output is out of order. The attention can be visualised in a plot, and you want this plot to be as diagonal as possible. Of course, how diagonal it can ever be also depends on the quality of your dataset.</p>

							<p>Interestingly, we found that within the first 10 hours of training of the Text2Mel network we would get really good attention plots which yielded very good audio representation. We also found that comparatively the SSRN would perform equally well whether it was trained for 6 hours or 16 hours. And though you need to train a separate SSRN network for each voice, we also found that re-using the SSRN from a previous voice can also work and sometimes produces interesting results (such as more gender neutral sounding voices when using the Text2Mel from a female voice and the SSRN from a male voice).</p>

							<div className='side-by-side'>
								<figure className='audio'>
									<AudioPlayer file='articles/andrew-1591974063.62.wav' />
									<figcaption>Output with Text2Mel and SSRN trained on a male voice</figcaption>
								</figure>

								<figure className='audio'>
									<AudioPlayer file='articles/andrew-1591973740.29.wav' />
									<figcaption>Output with Text2Mel from a male voice and SSRN from a female voice</figcaption>
								</figure>
							</div>

							<p>The usual process as described in the paper still relies on large datasets for extensive training. The difference here is that we use the 24 hour-long public domain LJ dataset to train a solid foundation, and then resume the training but switch the dataset to one of our 2-3 hour-long regional ones. By training on top we benefit from the foundations, but the model is effectively “tuned” to the new voice.</p>
						</section>

						<section>
							<SectionDivider {...toc[2]} />

							<p>For the study, we had our set of sentences to synthesise, but before getting to those we tried a few of the Harvard Sentences as well as some arbitrary ones. The resulting audio files were unmistakably recognisable as the original voice, though they had a distinct metallic quality which set them apart from the real voice.</p>

							<SectionDivider {...toc[3]} />
							<p>Even though we improved pronunciation considerably by using a phonetically-balanced dataset, the models were still making occasional mistakes. Because the network essentially maps letters to frequencies, though, we were able to correct that by modifying the spelling of problematic words to something a little more phonetic. For example, “chaos” can be difficult for the machine to pronounce because it derives from Greek, which is unusual in English. However, if we spell it “kayohss” we make the sounds very explicit to the machine and we get better results.</p>

							<div className='side-by-side'>
								<figure className='audio'>
									<AudioPlayer file='articles/andrew-1591972337.57.wav' />
									<figcaption>the chaos at the scene was incomprehensible</figcaption>
								</figure>

								<figure className='audio'>
									<AudioPlayer file='articles/andrew-1591972095.69.wav' />
									<figcaption>the kayohss at the scene was incomprehensible</figcaption>
								</figure>
							</div>

							<SectionDivider {...toc[4]} />
							<p>Pauses can also be troublesome. We already discussed how we shortened silences and trimmed the audio files to reduce that problem, but when we write we use semantic punctuation to guide the reader in the rhythm of the sentence. Commas, full stops, em dashes are all ways to convey which kind of pause to apply when speaking. And though the machine can process that input, mapping it to a very variable length of pause led to some issues. Sometimes, a word would be skipped or sometimes the machine would descend into madness and output only gibberish. We haven’t been able to find out exactly what the issue is but we have managed to curb it a little by chunking the text before sending it to be synthesised.</p>

							<div className='with-sidenote'>
								<p>The network can only synthesise chunks of a certain length. If your sentence or paragraph is longer than that, you’ll have to synthesise distinct chunks and glue them together in the output. That can lead to a strange rhythm in the delivery as well as the aforementioned issues with pauses. So instead we rewrote the chunking algorithm to split on commas and full stops as much as possible to let the network synthesise complete uninterrupted chunks which we could later join with the appropriate spaces.</p>

								<figure className='audio'>
									<AudioPlayer file='articles/andrew%20%281%29%20%281%29.wav' />
									<figcaption>Punctuation and pauses can result in some very strange output</figcaption>
								</figure>
							</div>

							<SectionDivider {...toc[5]} />
							<p>It’s not uncommon for text-to-speech systems to use a post-processing step to clean up the audio. Particularly, in our case, we want to soften the metallic twang the network output acquired. To do this, we set up a workflow in Adobe Audition which applied a vocal enhancer and a <a rel='noopener noreferrer' target='_blank' href='https://en.wikipedia.org/wiki/De-essing'>de&#8209;esser</a> filter. In some cases we found it useful to roll off either the 4/5kHz or the 1-2kHz frequencies. We experimented with applying various amounts of reverb to make them a little warmer but ultimately relented as the output was harder to understand.</p>

							<div className='side-by-side'>
								<figure className='audio'>
									<AudioPlayer file='articles/emma-1579021284.34.wav' />
									<figcaption>This is a sample without post-processing (raw output)</figcaption>
								</figure>

								<figure className='audio'>
									<AudioPlayer file='articles/ty-2-scotland-f%20%281%29.mp3' />
									<figcaption>This is the same sample but processed and compressed</figcaption>
								</figure>
							</div>

							<p>In the end, the synthesised results we obtained were superior to those achievable with the standard LJ dataset and training with the vanilla deep convolutional method. By using a phonetically-balanced dataset based on real-world speech and tuning a pre-trained model, as well as tweaking the pronunciation and post-processing the audio, the output was far clearer and of higher fidelity than we initially expected.</p>
						</section>

						<section>
							<SectionDivider {...toc[6]} />

							<p>This method is very promising when it comes to prototyping synthetic voices. With minimal cost and requirements, it was completely fit for our purpose. That said, there are few things we identified throughout this process that would need improvement.</p>

							<SectionDivider {...toc[7]} />

							<p>First, we would need to get to the bottom of the word skipping and garbled output. Evidence strongly suggests it’s to do with pauses and silences, but it would be beneficial to pinpoint whether the issue is with the datasets or the architecture of the network. Additionally, we would like to design a semi-automated evaluation method using our speech-to-text technology to aid us in that task.</p>

							<p>We also need to investigate the corpus further. We know that it has increased the quality of the voice and pronunciation, but maybe it could be improved. It might be that some of the less common combinations need to be slightly over-represented in order to give the network a chance to fetch them at the right time. It might also be that we need to tweak the length of sentences or simply find better methods to trim the audio and shorten the silences. However, at this time, we don’t have the tools to measure that confidently.</p>

							<p>Though all our voices are trained on the same corpus and nearly identical situations, each model took a different amount of time to train to an acceptable level. Additionaly, each model brought its own pronunciation challenges. Broadly speaking, they were quite stable on simple or common words, but more complex words would be pronounced correctly by some voices and garbled by others.</p>

							<SectionDivider {...toc[8]} />

							<p>Alternatively, we want to look into how the network processes its input. Right now, we feed the text directly to the network, but a pre-processing step on the input might allow us to better handle abbreviation (UK could be spelled out You Kay) or more ambitiously, we could convert the input to a phonetic transcription and train the network on the phonetic alphabet rather than the Latin alphabet. This would allow us a more precise way to specify the sounds we want to be included and moves the problem of converting English to phonetic further up the chain and out of the neural network path.</p>

							<figure>
								<img src='/static/images/articles/future-model.png' alt='Converting all input to a phonetic representation to allow more precise control over pronunciation' />
								<figcaption>Converting all input to a phonetic representation to allow more precise control over pronunciation</figcaption>
							</figure>

							<p>In the next article in this series we’ll cover how we used the synthesised voices to answer our research questions and discuss some of the UX insights we gleaned along the way.</p>
						</section>
						<Link href='/' legacyBehavior><a className='cta'>All articles <span className='arrow'>→</span></a></Link><br />
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default FastVoicePrototypingWithModelFineTuning
