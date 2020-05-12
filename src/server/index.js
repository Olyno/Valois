const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const chalk = require('chalk');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;
const PROD = process.env.DEV || false;
const { routes } = require('./routes');

const app = express();

if (!PROD) app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger(
    chalk.blueBright('[:remote-user] ')
    + chalk.bgBlue.white(':status')
    + chalk.magentaBright(' | :method')
    + chalk.greenBright(' :url ')
));
app.use(express.static('public'));

for (const route of routes) {
    app.use(route.path, route.router);
}

app.listen(PORT, () => {
    console.log(chalk.green('> Server started at ') + chalk.blueBright('http://localhost:' + PORT));
});