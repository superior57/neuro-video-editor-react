import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { Alert, Grid, TextField, Typography, Button, LinearProgress, Box, Fade, IconButton } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { makeStyles } from "@mui/styles";
import VideoPlayerScreen from "../components/VideoPlayer/Screen/Screen";
import VideoPlayerControl from "../components/VideoPlayer/Control/Control";
import { getFixedNumber } from "../utils/global-functions";
import FormattedTime from "../components/VideoPlayer/FormattedTime/FormattedTime";
import Canvas from "../components/Canvas/Canvas";
import VideoPlayBackground from "../components/VideoPlayer/Background/Background";
import Preview from "../components/Canvas/Preview";
import { Close } from "@mui/icons-material";

const useStyles = makeStyles(theme => ({
    button: {
        textTransform: "unset"
    },
    videoBackground: {
        position: "absolute",
        top: 0,
        width: '100%',
        height: '100%'
    },
    textPreview: {
        maxHeight: 450,
        height: 450,
        overflow: "hidden",
        overflowY: "auto"
    },
    videoCanvas: {
        right: 0,
        position: "absolute",
    },
    buttonDark: {
        color: '#000',
        paddingBottom: 0,
        paddingTop: 0
    },
    customFile: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: 'solid 1px gray',
        borderRadius: '30px !important',
        transition: "300ms",
        "&:hover": {
            boxShadow: theme.shadows[3],
            cursor: "pointer"
        },
        color: 'gray !important',
        textTransform: "unset",
        padding: '1px 4px'
    }
}))

var ffmpeg = ''
const defaultVideoWidth = 1200;

export default function Home() {
    const classes = useStyles();
    const videoEl = useRef(null);
    const btnAddTextRef = useRef(null);
    const [originalSource, setOriginalSource] = useState(null);
    const [localSource, setLocalSource] = useState("");
    const [source, setSource] = useState("");
    const [arrScript, setArrScript] = useState([]);
    const [current, setCurrent] = useState(0);
    const [currentTitle, setCurrentTitle] = useState(0);
    const [script, setScript] = useState("");
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState(false);
    const [videoWidth, setVideoWidth] = useState(defaultVideoWidth);
    const [zoomRate, setZoomRate] = useState(1);
    const [newScene, setNewScene] = useState([]);
    const [canvasDatas, setCanvasDatas] = useState([]);
       
    var player = null;
    var canvas = null;
    /* eslint no-unused-vars: 0 */
    var videoSourceEl = null;

    const [state, setState] = useState({
        isPlaying: false, 
        played: 0,   
        isSeeking: false,
        duration: 0
    })

    // lib
    const getCurrentSeconds = () => state.played * state.duration;
    const showVideo = (video) => {
        const data = ffmpeg.FS('readFile', video);        
        setSource(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
        setState({...state, 
            isPlaying: true
        })
    }
    const runCommand = (command) => {
        var arrCommands = command;
        if (typeof arrCommands === 'string') arrCommands = arrCommands.split(' ');
        return ffmpeg.run(...arrCommands);
    }
    const addScene = () => {
        const timeCurrent = getCurrentSeconds();
        if (timeCurrent === state.duration) return;
        var newCanvasDatas = [];
        canvasDatas.forEach((item) => {
            if ( timeCurrent > item.timeFrom && timeCurrent < item.timeTo ) {
                newCanvasDatas.push({ 
                    ...item,
                    timeTo: timeCurrent
                })
            } else if (timeCurrent !== item.timeFrom && item.timeFrom < timeCurrent) {
                newCanvasDatas.push({ ...item })                
            }
        });        
        newCanvasDatas.push({
            timeFrom: timeCurrent,
            timeTo: state.duration,
            data: [...newScene]
        });
        console.log(newCanvasDatas);
        setCurrent(current + 1);
        setCanvasDatas([ ...newCanvasDatas ]);        
    }
    const doAction = async () => {      
        const defaultHeight = 720;  
        const   outHeight = defaultHeight,
                outWidth = outHeight / ( 9 / 16 );

        const getRealScale = (value) => {
            const scaleRate = outHeight / defaultHeight;
            return value * scaleRate
        }

        const { width: canvaWidth, height: canvaHeight } = canvas.attrs;
        console.log("canvas =>", canvaWidth, canvaHeight);

        const x = (outWidth * 0.542 - getRealScale(27)) / canvaWidth;
        console.log(x);

        const   textareaWidth = outWidth * 0.542 - getRealScale(27),
                textareaHeight = canvaHeight * (textareaWidth / canvaWidth);
                
        const   videoareaWidth = outWidth * 0.415,
                videoareaHeight = outHeight - ( getRealScale(40) + getRealScale(80) );

        console.log("area =>", textareaWidth, textareaHeight);


        // load ffmpeg
        setProgress(true);
        setMessage('Loading ffmpeg-core.js');

        ffmpeg = createFFmpeg({ log: true });
        await ffmpeg.load();

        setMessage('Transcoding');
        console.log(canvasDatas);
        let i = 0;
        var textCanvasImages = [];
        var availableImages = [];
        for await (const data of canvasDatas) {
            if (data.image) {
                availableImages.push(data);
                const textImgName = `text-${i}.png`;
                ffmpeg.FS('writeFile', textImgName, await fetchFile(data.image));
                textCanvasImages.push('-i');
                textCanvasImages.push(textImgName);
                i ++;
            }
        }

        ffmpeg.FS('writeFile', 'example.mp4', await fetchFile(localSource));
        ffmpeg.FS('writeFile', 'default.png', await fetchFile('/img/default.png'));
        ffmpeg.FS('writeFile', 'default.mp3', await fetchFile('/audio/default.mp3'));

        await runCommand([
            '-i', 'default.png',
            '-i', 'example.mp4',
            ...textCanvasImages,
            '-filter_complex',
            `
                [0:v] scale=${outWidth}:${outHeight} [videobg]; 
                [1] scale=h=${videoareaHeight}:force_original_aspect_ratio=decrease,crop=w=${videoareaWidth} [video];            

                ${
                    textCanvasImages.length > 0 ? availableImages.map((_, index) => (
                        `[${index + 2}] scale=${textareaWidth.toFixed(0)}:${textareaHeight.toFixed(0)} [text${index}];`
                    )).join(' ') : ''
                }
                [videobg][video] overlay=${getRealScale(27)}:${getRealScale(38)} ${ textCanvasImages.length > 0 ? '[bg];' : '' }                 
                ${
                    textCanvasImages.length > 0 ? availableImages.map(({ timeFrom, timeTo }, index) => (`
                            [${index === 0 ? 'bg' : `video${index - 1}`}]
                            [text${index}] overlay=${outWidth - (textareaWidth + getRealScale(27))}:${getRealScale(50)}:enable='between(t, ${timeFrom}, ${timeTo})'                             
                            ${index !== canvasDatas.length - 1 ? `[video${index}];` : '' }
                    `)).join(' ') : ''
                }
            `,        
            'new.mp4'
        ]);

        setProgress(false);
        setMessage('Completed transcoding');
        closeMessage();
        showVideo('new.mp4');
    }
    const getCurrentText = (currentTime) => {    
        var curData = canvasDatas.find(({ timeFrom, timeTo }) => timeFrom === currentTime);       
        if (!curData) 
            curData = canvasDatas.find(({ timeFrom, timeTo }) => timeFrom <= currentTime && timeTo >= currentTime);        
        return curData?.data;
    }
    const exportVideo = () => {

    }
    const closeMessage = () => {
        setTimeout(() => {
            setProgress(false);
            setMessage("");
        }, 3000);
    }
    const upText = () => {
        const newDatas = [];       
        script.split('###').forEach(strMix => {
            if (!strMix) return;
            strMix.split('\n').forEach((strRow, index) => {
                let type = "text";
                if (script.split('###').length > 1 && index === 0) type = "title";
                if (strRow.trim() === "") return;
                newDatas.push({
                    type,
                    value: strRow.trim()
                })                  
            })
        });
        
        if (newDatas.length === 0) {
            newDatas.push(script);
        }

        setArrScript(newDatas);
        setNewScene([newDatas[0]]);
    }

    // handlers
    const handlePlayPause = () => {
        setState({...state, isPlaying: !state.isPlaying});
    }
    const handleVideoRewind = () => {
		setState({ ...state, isPlaying: false, played: 0 });
		player.seekTo(0);
	}
    const handleVideoSliderChange = (e) => {
		const played = getFixedNumber(e.target.value, 5);
		setState({ ...state,
            played, 		
        });            
        player.seekTo(played);
	}    
	const handleVideoSliderMouseUp = () => {
		setState({ ...state, 
            isSeeking: false 
        });
	}
	const handleVideoSliderMouseDown = () => {
		setState({ ...state, 
            isPlaying: false, isSeeking: true 
        });
	}
    const handleVideoProgress = (videoState) => {
		const { played } = videoState;
        if (!state.isSeeking) setState({ ...state, 
            played: getFixedNumber(played, 5) 
        });
	}
    const handlePlayerRef = (playerNew) => {
		player = playerNew;
	}
    const handleCanvasRef = (canvasNew) => {
        canvas = canvasNew;
    }
    const handleVideoDuration = (duration) => {
		setState({...state, 
            duration 
        });
	}
    const handleVideoEnded = () => {
		setState({ ...state,
            isPlaying: false,
        });
	}

    // system event handlers
    const handleResize = () => {
        const width = videoEl.current.clientWidth;
        setVideoWidth(width);
        setZoomRate(width / defaultVideoWidth);
    }
    const handleKeyDown = (ev) => {
        const { code } = ev;
        if (code === "Space") {
            btnAddTextRef.current.click();
            ev.preventDefault();
        }
    }
    const handleVideoSourceRef = (newVideoSourceEl) => {
        videoSourceEl = newVideoSourceEl;
    }

    // effect hooks
    useLayoutEffect(() => {
        window.addEventListener('resize', handleResize);        
        window.addEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        /* eslint react-hooks/exhaustive-deps: 0 */
        upText();
    }, [script])

    useEffect(() => {
        handleResize();
    }, [videoEl]);

    useEffect(() => {
        // canvas capture to image when added new scene
        const timeCurrent = getCurrentSeconds();
        const curData = canvasDatas.find(({ timeFrom, timeTo }) => timeFrom <= timeCurrent && timeTo > timeCurrent)
        if (curData && !curData?.image) {
            const newCanvasDatas = [
                ...canvasDatas.map((item) => {
                    if (item.timeFrom <= timeCurrent && item.timeTo > timeCurrent) {
                        return {
                            ...item,
                            image: canvas.toDataURL()
                        }
                    }
                    return { ...item }
                })
            ];
            setCanvasDatas([ ...newCanvasDatas ]);
        }
    }, [canvasDatas]);

    useEffect(() => {
        if (current !== 0) {
            if (arrScript[current]?.type === "title") {
                setCurrentTitle(current);
                setNewScene([
                    ...arrScript.filter((script, i) => i <= current && i >= current )
                ]);   
            } else {
                setNewScene([
                    ...arrScript.filter((script, i) => i <= current && i >= currentTitle )
                ]);   
            }                      
        }
    }, [current])

    return (
        <div className="w-100 px-3">
            
            {
                message && <Fade in={!!message}>
                    <Alert className="mb-3" severity="info">
                        { message }
                        {
                            progress && <Box sx={{ width: '100%' }}>
                                <LinearProgress />
                            </Box>
                        }
                    </Alert>
                </Fade> 
            }   
            
            <Button variant="text" className={classes.buttonDark}>
                <Typography variant="h3" color="initial">
                    <FormattedTime seconds={ getCurrentSeconds() } />    
                </Typography> 
            </Button>

            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <div>
                        <div ref={videoEl} className="position-relative d-flex justify-content-center">
                            <VideoPlayerScreen
                                isPlaying={state.isPlaying}
                                played={state.played}
                                url={ source || localSource }
                                width={ videoWidth }
                                playerRef={handlePlayerRef}
                                onProgress={handleVideoProgress}
                                onDuration={handleVideoDuration}       
                                onEnded={handleVideoEnded}        
                                zoomRate={zoomRate}    
                                previewMode={!source}
                                videoSourceRef={handleVideoSourceRef}
                            />
                            {
                                !source && <>
                                    <VideoPlayBackground 
                                        width={videoWidth}
                                    />
                                    <Canvas 
                                        canvasWidth={ videoWidth }
                                        className={classes.videoCanvas}
                                        canvasRef={ handleCanvasRef }
                                        zoomRate={ zoomRate }
                                        data={getCurrentText(getCurrentSeconds())}
                                    />
                                </>
                            }
                        </div>

                        <VideoPlayerControl 
                            isPlaying={state.isPlaying}
                            played={state.played}
                            duration={state.duration}
                            onPlayPause={handlePlayPause}
                            onSliderChange={handleVideoSliderChange}
                            onSliderMouseUp={handleVideoSliderMouseUp}
                            onSliderMouseDown={handleVideoSliderMouseDown}
                            onRewind={handleVideoRewind}
                        />
                    </div>                   
                    
                    <Grid container spacing={2} className="mt-2">
                        <Grid item xs={12} md={8}>
                            <Button ref={btnAddTextRef} fullWidth className={classes.button + " mt-2"} variant="contained" color="primary" disabled={!localSource} onClick={addScene}>
                                { 'Click here or press the [SPACE] bar to sync your script' }
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <div className="d-flex">
                                <Button fullWidth type="submit" className={classes.button + " mt-2 me-2"} variant="contained" color="primary" disabled={!localSource} onClick={doAction}>
                                    { 'Rend Video' }
                                </Button>
                                <Button 
                                    component="a" 
                                    href={ source } 
                                    download 
                                    fullWidth 
                                    className={classes.button + " mt-2 text-white"} 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={exportVideo}
                                    disabled={!source}
                                >
                                    { 'DONE / EXPORT' }
                                </Button>
                            </div>
                        </Grid>                      
                    </Grid>
                </Grid>            
                <Grid item xs={12} md={4} className="flex-column d-flex">       
                    <div className="d-flex mb-2">                        
                        {
                            !!originalSource ? <Fade in>
                                <Button 
                                    className={classes.customFile}
                                    component="div"
                                    size="sm"
                                >
                                    <div className="px-3">{ "File: " + originalSource?.name }</div>
                                    <IconButton color="default" size="sm" onClick={() => {
                                        setOriginalSource(null);
                                        setLocalSource(null);
                                    }} >
                                        <Close />
                                    </IconButton>
                                </Button>
                            </Fade> : <Fade in>
                                    <Button variant="contained" component="label" color="primary" className={classes.button}>
                                        Upload video
                                        <input 
                                            hidden 
                                            type="file" 
                                            accept="video/*" 
                                            onChange={ev => {
                                                setOriginalSource(ev.target.files[0]);
                                                setLocalSource(URL.createObjectURL(ev.target.files[0]));
                                            }}
                                        />                          
                                    </Button>
                                </Fade>
                        }
                    </div>
            
                    <Button fullWidth type="submit" className={classes.button + " mt-2 text-black"} >
                        { 'Up next' }
                    </Button>    
                    <Preview 
                        className={classes.textPreview}
                        data={newScene}
                    />
            
                    <Button fullWidth type="submit" className={classes.button + " mt-2 text-black"} >
                        { 'Full Script' }
                    </Button>                  
                    
                    <TextField
                        className="mt-2"
                        variant="standard"
                        fullWidth
                        value={script}
                        onChange={ev => setScript(ev.target.value)}
                        multiline
                        rows={10}
                        placeholder="Enter full script here..."
                    />                                         
                </Grid>
            </Grid>
        </div>
    )
}