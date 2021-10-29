import { makeStyles } from "@mui/styles";
import { useRef } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";
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
        fill: "#c79745",
        fontSize: defaultSize.title * zoomRate
    }
    const textOptions = {
        fill: "white",
        fontSize: defaultSize.text * zoomRate,
    }
    const getRealOptions = (type) => {
        return type === "title" ? titleOptions : textOptions;
    }
    
    const getRealValue = (value) => {
        return value * zoomRate
    }
    var totalHeight = 0;

    const width = canvasWidth *0.542 - getRealValue(defaultSize.marginRight);

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
                    data.map(({ type, value }, index) => (
                        <Text 
                            width={width}
                            key={'canvas-text-' + index}
                            x={0}
                            y={getMarginTop(index)}
                            text={value}
                            fill={getRealOptions(type).fill}
                            fontSize={getRealOptions(type).fontSize}
                        />
                    ))
                }                
            </Layer>
        </Stage>
    )
}