const express = require('express');
const logger = require('morgan');
const path = require('path');
const http = require('http');
const app = express();

const port = process.env.APP_PORT || 6780;

// Set middleware
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger('combined'));

app.post("*", (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

http.createServer(app).listen(port, () => {
    console.info(`Server is listening on port ${port}`);
});
