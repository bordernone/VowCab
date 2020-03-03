const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('../config/index');

var entriesRoute = require('./routes/entries');


app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/api', entriesRoute);

const port = config.backend_port;

app.listen(port, () => {
    console.log("listening to port " + port);
});