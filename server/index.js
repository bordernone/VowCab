const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const config = require('../config/index');

var entriesRoute = require('./routes/entries');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client/build')));


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', entriesRoute);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '/client/build/index.html'));
});

const port = config.backend_port;

app.listen(port, () => {
    console.log("listening to port " + port);
});