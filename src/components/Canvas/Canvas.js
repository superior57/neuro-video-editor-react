import React, {} from "react";
import { Layer, Stage, Text, Shape } from "react-konva";

const defaultSize = {
    title: 34,
    text: 25,
    textLineSpacing: 15,
    marginTop: 50,
    marginRight: 27,
    marginBottom: 130
}

const RowHeadShape = ({
    color,
    x = 0,
    y = 0,
    zoomRate
}) => {
    const getRealValue = (value) => {
        return value * zoomRate
    }

    return <Shape 
        fill={color}
        sceneFunc={(context, shape) => {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + getRealValue(10), y + getRealValue(7.5));
            context.lineTo(x + 0, y + getRealValue(15));
            context.closePath();
            context.fillStrokeShape(shape);
        }}
    />
}

export default function Canvas({
    canvasWidth = 300,
    canvasHeight = 300,
    className = "",
    canvasRef = () => {},
    zoomRate = 1,
    data = [],
    controlWidth,
    controlHeight,
    controlZoomRate,
}) {
    const titleOptions = {
        fill: "#FFAF04",
        fontSize: defaultSize.title,
        align: "center"
    }
    const textOptions = {
        fill: "white",
        fontSize: defaultSize.text,
        align: "left"
    }
    const getRealOptions = (type) => {
        const resOptions = type === "title" ? titleOptions : textOptions;
        return {
            ...resOptions,
            fontSize: resOptions.fontSize * zoomRate
        }
    }
    const getRealControlOptions = (type) => {
        const resOptions = type === "title" ? titleOptions : textOptions;
        return {
            ...resOptions,
            fontSize: resOptions.fontSize * controlZoomRate
        }
    }
    
    const getRealValue = (value) => {
        return value * zoomRate
    }
    const getRealValueControl = (value) => {
        return value;
    }

    var totalHeight = 0;
    var totalHeightControl = 0;

    const width = canvasWidth * 0.542 - getRealValue(defaultSize.marginRight);

    const getMarginTop = (index) => {
        const prevData = data[index - 1];
        var prevHeight = 0;
        if (prevData) {
            const prevLine = prevData.value;
            const el = document.createElement('h6');
            el.style.width = `${width}px`;
            el.style.fontSize = `${getRealOptions(prevData.type).fontSize - 1}px`;
            el.style.position = 'fixed';
            el.style.opacity = 0;
            el.style.zIndex = '-1';
            el.append(prevLine);
            document.body.append(el)
            prevHeight = el.clientHeight + getRealValue(defaultSize.textLineSpacing);

            if (prevData.type !== data[index]?.type) {
                prevHeight += getRealValue(10);
            }

            totalHeight += prevHeight;
            return totalHeight
        }
        return 0;
    }

    const getMarginTopControl = (index) => {
        const prevData = data[index - 1];
        var prevHeight = 0;
        if (prevData) {
            const prevLine = prevData.value;
            const el = document.createElement('h6');
            el.style.width = `${controlWidth}px`;
            el.style.fontSize = `${getRealControlOptions(prevData.type).fontSize - 1}px`;
            el.style.position = 'fixed';
            el.style.opacity = 0;
            el.style.zIndex = '-1';
            el.append(prevLine);
            document.body.append(el)
            prevHeight = el.clientHeight + getRealValueControl(defaultSize.textLineSpacing);

            if (prevData.type !== data[index]?.type) {
                prevHeight += getRealValueControl(10);
            }

            totalHeightControl += prevHeight;
            return totalHeightControl
        }
        return 0;
    }

    return (
        <React.Fragment>
            <Stage 
                // ref={ canvasRef }
                width={width.toFixed(0)}
                height={ (canvasWidth * (9 / 16) - (getRealValue(defaultSize.marginTop) + getRealValue(defaultSize.marginBottom))).toFixed(0) }
                className={className}
                style={{
                    right: getRealValue(defaultSize.marginRight),
                    top: getRealValue(defaultSize.marginTop)
                }}
            >
                <Layer >           
                    {
                        data.map(({ type, value }, index) => {
                            var newValue = value;
                            var y = getMarginTop(index);
                            if (value[0] === "-")
                                newValue = newValue.substring(1);
                            return (
                                <React.Fragment key={'canvas-text-' + index}>
                                    {
                                        value[0] === "-" && <RowHeadShape 
                                            color={titleOptions.fill}
                                            x={0}
                                            y={y + getRealValue(3)}
                                            zoomRate={zoomRate}
                                        />
                                    }
                                    <Text 
                                        width={width}
                                        x={value[0] === "-" ? getRealValue(20) : 0}
                                        y={y}
                                        text={newValue}
                                        fill={getRealOptions(type).fill}
                                        fontSize={getRealOptions(type).fontSize}
                                        align={getRealOptions(type).align}
                                    />
                                </React.Fragment>
                            )
                        })
                    }                
                </Layer>
            </Stage>

            <Stage 
                ref={ canvasRef }
                width={ controlWidth }
                height={ controlHeight }
                className={className + " control d-none"}
                style={{
                    right: getRealValueControl(defaultSize.marginRight),
                    top: getRealValueControl(defaultSize.marginTop)
                }}
            >
                <Layer >           
                    {
                        data.map(({ type, value }, index) => {
                            var newValue = value;
                            var y = getMarginTopControl(index);
                            if (value[0] === "-")
                                newValue = newValue.substring(1);
                            return (
                                <React.Fragment key={'canvas-text-' + index}>
                                    {
                                        value[0] === "-" && <RowHeadShape 
                                            color={titleOptions.fill}
                                            x={0}
                                            y={y + getRealValueControl(3)}
                                            zoomRate={controlZoomRate}
                                        />
                                    }
                                    <Text 
                                        width={controlWidth}
                                        x={value[0] === "-" ? getRealValueControl(20) : 0}
                                        y={y}
                                        text={newValue}
                                        fill={getRealControlOptions(type).fill}
                                        fontSize={getRealControlOptions(type).fontSize}
                                        align={getRealControlOptions(type).align}
                                    />
                                </React.Fragment>
                            )
                        })
                    }                
                </Layer>
            </Stage>
        </React.Fragment>
    )
}