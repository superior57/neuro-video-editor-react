const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

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
app.get("", (req, res) => {
    app.use(express.static(path.join(__dirname, 'build')));

    return res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(port, () => console.info('app is running on: ' + port));