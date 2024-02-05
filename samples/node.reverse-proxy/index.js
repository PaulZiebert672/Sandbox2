// Elementary HTTP reverse proxy
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const axios = require('axios').default;
const { uuid } = require('uuidv4');
const dotenv = require('dotenv').config();

// Configuration
const app = express();
const port = process.env.APP_PORT || 16221;
const proxyTarget = process.env.REQ_TARGET || null;

// Set middleware
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
}));

// Request handler
app.all('*', async (req, res) => {
    const id = uuid();
    const path = req.path;
    const method = req.method;
    const requestHeaders = req.headers, requestContentType = requestHeaders['content-type'];
    if(method == 'GET') {
        // console.log(`--> req ${id} ${method} ${path}: ${JSON.stringify(req.query)}, headers=${JSON.stringify(req?.headers)}`);
        console.log(`--> req ${id} ${method} ${path}: ${JSON.stringify(req?.query)}`);
    } else {
        // console.log(`--> req ${id} ${method} ${path} ${requestContentType}: ${JSON.stringify(req.body)}, headers=${JSON.stringify(req?.headers)}`);
        console.log(`--> req ${id} ${method} ${path} ${requestContentType}: ${JSON.stringify(req.body)}`);
    }
    let target = req.query?.target ?? proxyTarget;
    if(target === null) {
        return res.status(400).json({ msg: 'proxy target is not specified' });
    }
    if(path.charAt(0) == '/') { target = target + path; } // ??
    try {
        let response;
        if(method == 'GET') {
            response = await axios.get(target, {
                params: req.query,
                responseType: 'arraybuffer'
            });
            // console.log(`<-- res ${id} ${response.status}: headers=${JSON.stringify(response?.headers)}`);
            console.log(`<-- res ${id} ${response.status}`);
            const responseHeaders = response.headers, responseContentType = responseHeaders['content-type'];
            res.contentType(responseContentType ?? 'application/octet-stream');
            res.end(response.data, 'binary');
            return;
        } else {
            response = await axios.post(target, req.body, {
                headers: { 'content-type': requestContentType }
                // headers: req.headers
            });            
            const responseHeaders = response.headers, responseContentType = responseHeaders['content-type'];
            if(method == 'POST' && requestContentType == 'application/x-www-form-urlencoded') {
                // console.log(`<-- res ${id} ${response.status}: headers=${JSON.stringify(response?.headers)}`);
                console.log(`<-- res ${id} ${response.status}`);
                res.contentType(responseContentType ?? 'application/octet-stream');
                res.end(response.data);
                return;
            }
            // console.log(`<-- res ${id} ${response.status}: ${JSON.stringify(response.data)}, headers=${JSON.stringify(response?.headers)}`);
            console.log(`<-- res ${id} ${response.status}: ${JSON.stringify(response.data)}`);
            return res.status(response.status).json(response.data);
        }
    } catch(e) {
        console.error(`--X req ${id} error: ${e.message}`);
        const data = e.response?.data;
        return res.status(e.response?.status ?? 502).json({
            target: target,
            msg: e.message,
            response: {
                data: (data instanceof Buffer)? data.toString('utf8'): data,
                headers: e.response?.headers,
                status: e.response?.status
            }
        });
    }
});

// Run server
app.listen(port, () => {
    console.info(`Server is listening on port ${port}`);
    console.info(`Requests are forwarded to ${proxyTarget}`);
});