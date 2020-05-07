const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const { express: koporei } = require('koporei');

const chalk = require('chalk');

const PORT = process.env.PORT || 3000;
const PROD = process.env.DEV || false;
const { me } = require('./routes');

const app = express();

if (!PROD) app.use(cors());

app.use(express.json());
app.use(logger('combined'));
app.use(me.path, me.router);
app.use(koporei({
    pages: __dirname + '/../pages'
}));

app.listen(PORT, () => {
    console.log(chalk.green('> Server started at ') + chalk.blueBright('http://localhost:' + PORT));
});