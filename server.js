const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

const ytdl = require('ytdl-core');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/v1/test', (req, res, next) => {
    return res.send({
        data: "ok"
    });
})

app.get('/api/v1/download-ytd', async (req, res, next) => {
    const uri = req.query.src;
    console.log('downloading ...');
    try {
        await ytdl(uri).pipe(fs.createWriteStream('public/video/video.mp4'));
        console.log("done");
    } catch (error) {
        console.log(error);        
    }
    return res.send({
        data: "ok"
    });
})

app.listen(port, () => console.info('app is running on: ' + port));