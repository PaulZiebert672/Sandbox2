const express = require('express');
const logger = require('morgan');
const axios = require('axios');
const http = require('http');
const app = express();

const port = process.env.APP_PORT || 6781;

// Set middleware
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger('combined'));

app.post("*", async (req, res) => {
    console.log('headers',  req.headers);
    console.log('body:', req.body);
    try {
        var payload = await axios.post('http://localhost:6780', req.body, {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        });
        console.log(payload.status);
        if(payload.status != 200) {
            throw new Error(`status = ${payload.status}`);
        }
        return res.json(payload.data);
    } catch(err) {
        console.error('connection error:' + err.message);
        return res.status(502).json({ msg: err.message });
    }
});

http.createServer(app).listen(port, () => {
    console.info(`Server is listening on port ${port}`);
});
