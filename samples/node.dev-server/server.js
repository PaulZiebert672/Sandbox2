const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.APP_PORT || 16782;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(logger('common'));

app.use('/public', express.static('public'));
app.use('/euler-ode', express.static('../euler-ode'));
app.use('/jstoy', express.static('../jstoy'));
app.use('/request2', express.static('../request2'));

app.use('/gravity', express.static('./import/gravity'));
app.use('/solitaire', express.static('./import/solitaire'));

app.use(express.urlencoded({ extended: false }));
app.use('/ode', require('./routes/ode/main'));

app.listen(port, () => {
    console.info(`Server is listening on port ${port}`);
});
