/* eslint-disable jsx-a11y/media-has-caption */
import { useState, useRef } from 'react'
import classNames from 'classnames'

const AudioPlayer = ({ file }) => {
	const mediaEl = useRef()
	const [progress, setProgress] = useState(0)
	const [isPlaying, setPlaying] = useState(false)

	const handleOnClick = () => {
		if (!isPlaying) {
			mediaEl.current.load()
			mediaEl.current.play()
		}
		else {
			mediaEl.current.pause()
			mediaEl.current.currentTime = 0
		}

		setPlaying(!isPlaying)
	}

	const className = classNames('audio-player', {
		playing: isPlaying
	})

	return <button onClick={handleOnClick} className={className}>
		<div className='inside-wrapper'>
			<div className='progress' style={{ width: `${Math.ceil(progress * 100)}%` }} />
			<img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/images/play.svg`} className='play' alt='Play' />
			<audio
				preload='auto'
				onTimeUpdate={() => setProgress(mediaEl.current.currentTime / mediaEl.current.duration)}
				onEnded={() => setPlaying(false)}
				ref={mediaEl}
			>
				<source src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/static/audio/${file}`} type={file.includes('.mp3') ? 'audio/mpeg' : 'audio/wav'} />
			</audio>
		</div>
	</button>
}

export default AudioPlayer
