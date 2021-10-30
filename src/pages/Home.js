import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { Alert, Grid, TextField, Typography, Button, LinearProgress, Box, duration, Paper, Fade, Grow } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { makeStyles } from "@mui/styles";
import VideoPlayerScreen from "../components/VideoPlayer/Screen/Screen";
import VideoPlayerControl from "../components/VideoPlayer/Control/Control";
import { getFixedNumber, getYoutubeId } from "../utils/global-functions";
import FormattedTime from "../components/VideoPlayer/FormattedTime/FormattedTime";
import Canvas from "../components/Canvas/Canvas";
import VideoPlayBackground from "../components/VideoPlayer/Background/Background";
import Preview from "../components/Canvas/Preview";
import { videoService } from "../services/video";

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
    }
}))

var ffmpeg = ''
const defaultVideoWidth = 1200;

export default function Home() {
    const classes = useStyles();
    const videoEl = useRef(null);
    const btnAddTextRef = useRef(null);
    const [originalSource, setOriginalSource] = useState("/video/example.mp4");
    const [localSource, setLocalSource] = useState("");
    const [source, setSource] = useState("");
    const [script, setScript] = useState(`### The first obstacle businesses struggle with when switching to recurring revenue

    - What you deliver must provide outsized value to your members
    - It must not just be intellectual entertainment
    - It must provoke your members to take action
    - This way, theyâ€™ll want to keep receiving the benefits
    
    ### The biggest tragedy (and opportunity) in the business worldâ€¦
    
    - The mistake most people make is they do a great job at selling the subscriptionâ€¦
    - But their quality of delivery is mediocre or out of alignment with what subscribers expected
    - So the retention is very low.
    - This is the biggest tragedy in the world: to be successful on the marketing sideâ€¦ and not to deliver what is expected
    `);
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState(false);
    const [videoWidth, setVideoWidth] = useState(defaultVideoWidth);
    const [zoomRate, setZoomRate] = useState(1);
    const [newScene, setNewScene] = useState([]);
    const [canvasDatas, setCanvasDatas] = useState([]);

       
    var player = null;
    var canvas = null;

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
        var newCanvasDatas = [];
        canvasDatas.forEach((item) => {
            if ( timeCurrent > item.timeFrom && timeCurrent < item.timeTo ) {
                newCanvasDatas.push({ 
                    ...item,
                    timeTo: timeCurrent
                })
            } else if (timeCurrent != item.timeFrom && item.timeFrom < timeCurrent) {
                newCanvasDatas.push({ ...item })                
            }
        });        
        newCanvasDatas.push({
            timeFrom: timeCurrent,
            timeTo: state.duration,
            data: [...newScene]
        });

        setCanvasDatas([ ...newCanvasDatas ]);        
    }
    const doAction = async () => {
        const [ width, height ] = [
            800, 896
        ]

        // load ffmpeg
        setProgress(true);
        setMessage('Loading ffmpeg-core.js');

        ffmpeg = createFFmpeg({ log: true });
        await ffmpeg.load();

        var videoUrl = "https://youtu.be/i408lXhDviM";
        videoUrl = "/video/example.mp4";

        setMessage('Transcoding');

        let i = 0;
        var textCanvasImages = [];
        for await (const data of canvasDatas) {
            const textImgName = `text-${i}.png`;
            ffmpeg.FS('writeFile', textImgName, await fetchFile(data.image));
            textCanvasImages.push('-i');
            textCanvasImages.push(textImgName);
            i ++;
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
                [1] scale=h=${height},crop=w=${width} [video];            

                ${
                    canvasDatas.map((_, index) => (
                        `[${index + 2}] scale=960:${height}:force_original_aspect_ratio=decrease [text${index}];`
                    )).join(' ')
                }
                [0:v][video] overlay=41:58 [bg];                
                ${
                    canvasDatas.map(({ timeFrom, timeTo }, index) => (`
                            [${index === 0 ? 'bg' : `video${index - 1}`}]
                            [text${index}] overlay=870:100:enable='between(t, ${timeFrom}, ${timeTo})'                             
                            ${index != canvasDatas.length - 1 ? `[video${index}];` : '' }
                    `)).join(' ')
                }
            `,            
            'new.mp4'
        ]);

        setProgress(false);
        setMessage('Complete transcoding');
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
                newDatas.push({
                    type,
                    value: strRow.trim()
                })                  
            })
        })
        
        setNewScene(newDatas);
    }
    const loadVideo = async () => {
        const videoId = getYoutubeId(originalSource);
        if (videoId) {
            console.log(videoId);
            const res = await videoService.downloadYtd(videoId);        
            setLocalSource(`/video/${videoId}.mp4`);
        } else 
            setLocalSource(originalSource);            
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
        }
    }

    // effect hooks
    useLayoutEffect(() => {
        window.addEventListener('resize', handleResize);        
        window.addEventListener('keydown', handleKeyDown);

        // await downloadYtd('https://youtu.be/KvLtvw04f1o');
    }, [])

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
                            <Button ref={btnAddTextRef} fullWidth className={classes.button + " mt-2"} variant="contained" color="primary" onClick={addScene}>
                                { 'Add Text ( Press Spacebar )' }
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <div className="d-flex">
                                <Button fullWidth type="submit" className={classes.button + " mt-2 me-2"} variant="contained" color="primary" onClick={doAction}>
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
                                    { 'Done Export' }
                                </Button>
                            </div>
                        </Grid>                      
                    </Grid>
                </Grid>            
                <Grid item xs={12} md={4} className="flex-column d-flex">       
                    <TextField
                        className="mb-2"
                        variant="standard"
                        label="Video source" 
                        fullWidth
                        value={originalSource}
                        onChange={ev => setOriginalSource(ev.target.value)}
                    />      
                        

                    <Button fullWidth type="submit" className={classes.button + " mb-2"} variant="contained" color="primary" onClick={loadVideo}>
                        { 'Load Video' }
                    </Button>

                    <Preview 
                        className={classes.textPreview}
                        data={newScene}
                    />
            
                    <Button fullWidth type="submit" className={classes.button + " mt-2"} variant="contained" color="primary" onClick={upText}>
                        { 'Up Text' }
                    </Button>
                    
                    <TextField
                        className="mt-2"
                        variant="standard"
                        label="Full Script" 
                        fullWidth
                        value={script}
                        onChange={ev => setScript(ev.target.value)}
                        multiline
                        rows={10}
                    />
                                         
                </Grid>
            </Grid>
        </div>
    )
}