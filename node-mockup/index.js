const express = require('express');
const logger = require('morgan');
const path = require('path');
const http = require('http');
const router = express.Router();
const app = express();

const dir = 'pub';
const port = process.argv[2] || process.env.APP_PORT || 6780;

router.get('/OnlineOperations/CheckChange', (req, res) => {
    console.log('~~> ', req.query);
    res.header('Content-Type', 'application/json');
    res.write(JSON.stringify({
        "respKey": "RespVal"
    }));
    res.end();
});

app.use(logger('combined'));
app.use(express.static(dir));
app.use('/', router);

http.createServer(app).listen(port, () => {
    console.info(`Server root=${dir} listening on port ${port}`);
});
