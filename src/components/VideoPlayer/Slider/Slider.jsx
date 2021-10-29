// import React from 'react';
// import PropTypes from 'prop-types';
// import './slider.scss';
// import { alpha, Box, styled } from '@mui/system';
// import { SliderUnstyled } from '@mui/core';

// const StyledSlider = styled(SliderUnstyled)(
// 	({ theme }) => `
// 		color: ${theme.palette.mode === 'light' ? '#1976d2' : '#90caf9'};
// 		height: 4px;
// 		width: 100%;
// 		padding: 13px 0;
// 		display: inline-block;
// 		position: relative;
// 		cursor: pointer;
// 		touch-action: none;
// 		-webkit-tap-highlight-color: transparent;
// 		opacity: 0.75;
// 		&:hover {
// 		opacity: 1;
// 		}
	
// 		& .MuiSlider-rail {
// 		display: block;
// 		position: absolute;
// 		width: 100%;
// 		height: 4px;
// 		border-radius: 2px;
// 		background-color: currentColor;
// 		opacity: 0.38;
// 		}
	
// 		& .MuiSlider-track {
// 		display: block;
// 		position: absolute;
// 		height: 4px;
// 		border-radius: 2px;
// 		background-color: currentColor;
// 		}
	
// 		& .MuiSlider-thumb {
// 		position: absolute;
// 		width: 14px;
// 		height: 14px;
// 		margin-left: -6px;
// 		margin-top: -5px;
// 		box-sizing: border-box;
// 		border-radius: 50%;
// 		outline: 0;
// 		border: 2px solid currentColor;
// 		background-color: #fff;
	
// 		:hover,
// 		&.Mui-focusVisible {
// 			box-shadow: 0 0 0 0.25rem ${alpha(
// 			theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
// 			0.15,
// 			)};
// 		}
	
// 		&.Mui-active {
// 			box-shadow: 0 0 0 0.25rem ${alpha(
// 			theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
// 			0.3,
// 			)};
// 		}
// 		}
// 	`,
// );

// export default function Slider({
// 	className, onMouseUp, onMouseDown, onChange, played
// }) {
// 	return (
// 		<Box sx={{ width: '100%' }}>
// 			<StyledSlider 
// 				value={played}
// 				onMouseUp={ onMouseUp }
// 				onMouseDown={ onMouseDown }
// 				onChange={ onChange }
// 				onInput={ onChange }
// 				min={0}
// 				max={1}
// 				type="range"
// 			/>
// 		</Box>
// 	);
// }

import React from 'react';
import PropTypes from 'prop-types';
import './slider.scss';

const Slider = ({
	className, onMouseUp, onMouseDown, onChange, played,
}) => (
	<div className={ `player-slider${className ? ` ${className}` : ''}` }>
		<input
			type='range'
			min={ 0 }
			max={ 1 }
			step='any'
			value={ played }
			onMouseUp={ onMouseUp }
			onMouseDown={ onMouseDown }
			onChange={ onChange }
			onInput={ onChange }
		/>
	</div>
);

Slider.propTypes = {
	className: PropTypes.string,
	onMouseUp: PropTypes.func,
	onMouseDown: PropTypes.func,
	onChange: PropTypes.func,
	played: PropTypes.number,
};
Slider.defaultProps = {
	className: '',
	onMouseUp: () => {},
	onMouseDown: () => {},
	onChange: () => {},
	played: 0,
};

export default Slider;
