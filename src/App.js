import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import { Alert, Typography, Button, ThemeProvider, createTheme, TextField, Container } from '@mui/material';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { blue } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
  },
});

function App() {
  const videoEl = useRef(null);
  const [source, setSource] = useState("/flame.avi");
  const [tempSource, setTempSource] = useState("");
  const [message, setMessage] = useState("");
  const ffmpeg = createFFmpeg({ log: true });

  // useEffect(() => {
  //   message && setTimeout(() => {
  //     setMessage("");
  //   }, 3000);
  // }, [message]);

  const doAction = async () => {
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setMessage('Start transcoding');

    var videoUrl = "https://youtu.be/i408lXhDviM";
    // videoUrl = "/video/example.mp4";
    
    // ffmpeg.FS('writeFile', 'example.mp4', await fetchFile(videoUrl));
    ffmpeg.FS('writeFile', 'default.png', await fetchFile('/img/default.png'));
    ffmpeg.FS('writeFile', 'default.mp3', await fetchFile('/audio/default.mp3'));

    await runCommand([
      '-i', '$(youtube-dl -f 136 -g https://youtu.be/i408lXhDviM', 'example.mp4'
    ]);

    await runCommand('-i example.mp4 -filter:v crop=w=800,scale=h=900 default.mp4');
    
    // var arrCommands = [
    //   '-i', 'default.png', '-i', 'default.avi',
    //   '-filter_complex', "[0:v][1:v] overlay=43:58:enable='between(t,0,20)'",
    //   '-pix_fmt', 'yuv420p', '-c:a', 'copy',
    //   'test.mp4'
    // ]

    var arrCommands = [
      '-i', 'default.png', '-i', 'default.mp4',
      '-filter_complex', "[0:v][1:v]overlay=41:57",
      'test.mp4'
    ]

    await runCommand(arrCommands);

    
    setMessage('Complete transcoding');
    
    const data = ffmpeg.FS('readFile', 'test.mp4');
    
    setSource(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  }

  const runCommand = (command) => {
    var arrCommands = command;
    if (typeof arrCommands === 'string') arrCommands = arrCommands.split(' ');
    return ffmpeg.run(...arrCommands);
  }

  return (    
    <ThemeProvider theme={theme}>
      <Container >
        <div className="App">
          <Typography variant="h4" color="initial">Video Tool</Typography>   
            {
              message && <Alert severity="info">{ message }</Alert>
            }
            {/* <form className="w-100" onSubmit={ev => {
              ev.preventDefault();
              // setSource(tempSource);
              doAction();
            }}> */}
              <div className="w-100 d-flex">
                <TextField 
                  variant="standard"
                  label="File link" 
                  fullWidth
                  value={tempSource}
                  onChange={ev => setTempSource(ev.target.value)}
                />
                <Button type="submit" className="mt-2" variant="contained" color="primary" onClick={doAction}>
                  Open
                </Button>
              </div>
            {/* </form> */}
          <video className="mt-2" ref={videoEl} src={source} controls width="100%" autoPlay />
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;
