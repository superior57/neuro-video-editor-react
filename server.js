const express = require('express');
const path = require('path');
const app = express();
const port = 8080;
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => console.info('app is running on: ' + port));