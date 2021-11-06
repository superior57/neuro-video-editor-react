import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/lazy';
import './screen.scss';

const Screen = ({
	className,
	isPlaying,
	width,
	progressInterval,
	url,
	isLoop,
	playbackRate,
	onReady,
	onProgress,
	onDuration,
	onEnded,
	playerRef,
	zoomRate,
	previewMode,
	videoSourceRef
}) => {

	const height = width * (9 / 16);

	if (!previewMode) {
		return <ReactPlayer
			url={ url }
			playing={ isPlaying }
			id='react-player'
			ref={ playerRef }
			onReady={ onReady }
			onProgress={ onProgress }
			onDuration={ onDuration }
			onEnded={ onEnded }
			className={ `player-screen d-flex ${className ? ` ${className}` : ''}` }
			progressInterval={ progressInterval }
			controls={ false }
			loop={ isLoop }
			playbackRate={ playbackRate }
			width={ width }
			height={ height }
		/>
	} else {
		const getRealValue = (value) => {
			return value * zoomRate
		}
	
		return (
			<div ref={videoSourceRef} style={{
				position: "absolute",
				overflow: 'hidden',
				width: width * 0.415,
				height: height - (getRealValue(35) + getRealValue(80)),
				left: getRealValue( 24 ),
				top: getRealValue(35)
			}}>
				<ReactPlayer
					url={ url }
					playing={ isPlaying }
					id='react-player'
					ref={ playerRef }
					onReady={ onReady }
					onProgress={ onProgress }
					onDuration={ onDuration }
					onEnded={ onEnded }
					className={ `player-screen d-flex justify-content-center ${className ? ` ${className}` : ''}` }
					progressInterval={ progressInterval }
					controls={ false }
					loop={ isLoop }
					playbackRate={ playbackRate }
					width={ 'unset' }
					height={ '100%' }
					// controls
					// style={{
					// 	marginLeft: width * 0.3 * -1
					// }}
				/>
			</div>
		);
	} 
}

Screen.propTypes = {
	className: PropTypes.string,
	isPlaying: PropTypes.bool,
	width: PropTypes.number,
	progressInterval: PropTypes.number,
	url: PropTypes.string,
	isLoop: PropTypes.bool,
	playbackRate: PropTypes.number,
	onReady: PropTypes.func,
	onProgress: PropTypes.func,
	onDuration: PropTypes.func,
	onEnded: PropTypes.func,
	playerRef: PropTypes.func,
};
Screen.defaultProps = {
	className: '',
	isPlaying: false,
	width: 0,
	progressInterval: 100,
	url: '',
	isLoop: false,
	playbackRate: 1,
	onReady: () => {},
	onProgress: () => {},
	onDuration: () => {},
	onEnded: () => {},
	playerRef: () => {},
};

export default Screen;
