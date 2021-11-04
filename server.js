const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

const ytdl = require('ytdl-core');
const fs = require('fs');

// app.use(express.static(path.join(__dirname, 'public')));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Cross-Origin-Embedder-Policy', 'require-corp');
    res.header('Cross-Origin-Opener-Policy', 'same-origin');
    
    next();
}

app.use(allowCrossDomain);
app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/v1/test', (req, res, next) => {
    return res.send({
        data: "ok"
    });
})

app.get('/api/v1/download-ytd', async (req, res, next) => {
    const id = req.query.id;

    console.log('downloading ...');
    try {
        ytdl(id).pipe(fs.createWriteStream(`public/video/${id}.mp4`));
    } catch (error) {
        
    }
    console.log("done");
    
    return res.send({
        data: "ok"
    });
})

app.listen(port, () => console.info('app is running on: ' + port));