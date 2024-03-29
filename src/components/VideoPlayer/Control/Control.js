import React, {} from 'react';
import PropTypes from 'prop-types';
import { MdPlayArrow, MdPause, MdReplay } from 'react-icons/md';
import { ButtonGroup } from 'reactstrap';
import { Button } from "@mui/material";
import Slider from '../Slider/Slider.js';
import FormattedTime from '../FormattedTime/FormattedTime.js';
import './control.scss';

const Control = ({
	className,
	isPlaying,
	played,
	playbackRate,
	duration,
	fullscreen,
	showAnnotation,
	onSliderMouseUp,
	onSliderMouseDown,
	onSliderChange,
	onRewind,
	onPlayPause,
	onSpeedChange,
	onNextSecFrame,
	onPrevSecFrame,
	onFullScreen,
	onShowAnnotation
}) => {
	return (
		<div className={ `player-control${className ? ` ${className}` : ''}` } >
			<Slider
				played={ played }
				onMouseUp={ onSliderMouseUp }
				onMouseDown={ onSliderMouseDown }
				onChange={ onSliderChange }
			/>
			<div className='d-flex mt-2' style={{
					background: fullscreen ? 'gray' : ''
			}}>
				<div className='mr-auto d-flex align-items-center' >
					<ButtonGroup>
						<Button className='player-control__button d-flex align-items-center'  onClick={ onRewind }>
							<MdReplay className='player-control__icon' />
						</Button>
						<Button className='player-control__button d-flex align-items-center' onClick={ onPlayPause }>
							{isPlaying ? <MdPause className='player-control__icon' /> : <MdPlayArrow className='player-control__icon' />}
						</Button>
					</ButtonGroup>
				</div>
				<div className='d-flex align-items-center pr-4'>
					<Button className='player-control__button d-flex align-items-center' >
						<div className='player-control__time'>
							<FormattedTime seconds={ played * duration } />
							{' / ' }
							<FormattedTime seconds={ duration } />
						</div>
					</Button>
				</div>
			</div>
		</div>
	);
};

Control.propTypes = {
	className: PropTypes.string,
	isPlaying: PropTypes.bool,
	played: PropTypes.number,
	playbackRate: PropTypes.number,
	duration: PropTypes.number,
	onSliderMouseUp: PropTypes.func,
	onSliderMouseDown: PropTypes.func,
	onSliderChange: PropTypes.func,
	onRewind: PropTypes.func,
	onPlayPause: PropTypes.func,
	onSpeedChange: PropTypes.func,
	onNextSecFrame: PropTypes.func,
	onPrevSecFrame: PropTypes.func
};
Control.defaultProps = {
	className: '',
	isPlaying: false,
	played: 0,
	playbackRate: 1,
	duration: 0,
	onSliderMouseUp: () => {},
	onSliderMouseDown: () => {},
	onSliderChange: () => {},
	onRewind: () => {},
	onPlayPause: () => {},
	onSpeedChange: () => {},
	onPrevSecFrame: () => {},
	onNextSecFrame: () => {}
};

export default Control;
