import { makeStyles } from "@mui/styles";
import React, { useRef } from "react";
import { Layer, Rect, Stage, Text, Shape } from "react-konva";
import { Html } from "react-konva-utils";

const useStyles = makeStyles(theme => ({
    html: {
        position: "absolute",
        top: '50px !important',
        left: '20px !important'
    }
}))

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
    data = []
}) {
    const classes = useStyles();
    const titleOptions = {
        fill: "#FFAF04",
        fontSize: defaultSize.title * zoomRate,
        align: "center"
    }
    const textOptions = {
        fill: "white",
        fontSize: defaultSize.text * zoomRate,
        align: "left"
    }
    const getRealOptions = (type) => {
        return type === "title" ? titleOptions : textOptions;
    }
    
    const getRealValue = (value) => {
        return value * zoomRate
    }
    var totalHeight = 0;

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
            el.style.zIndex = '-1';
            el.append(prevLine);
            document.body.append(el)
            prevHeight = el.clientHeight + getRealValue(defaultSize.textLineSpacing);

            if (prevData.type != data[index]?.type) {
                prevHeight += getRealValue(10);
            }

            totalHeight += prevHeight;
            return totalHeight
        }
        return 0;
    }

    return (
        <Stage 
            ref={ canvasRef }
            width={width}
            height={ canvasWidth * (9 / 16) - (getRealValue(defaultSize.marginTop) + getRealValue(defaultSize.marginBottom)) }
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
                                    x={value[0] === "-" ? 20 : 0}
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
    )
}