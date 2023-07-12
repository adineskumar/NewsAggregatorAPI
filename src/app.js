/*
    Importing all your required modules
*/
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const redisClient = require("./clients/redis.client");
const urlSearchParams = require("url-search-params");
const path = require("path");
const morgan = require("morgan");
const routes = express.Router();
const rfs = require("rotating-file-stream");
const app_constants = require("./constants/app.constants");
const auth = require("./routes/auth.routes");
const pref = require("./routes/preference.routes");
const news = require("./routes/news.routes");

/*
    Loading Environmental Configs using 'dotenv'
    All the config parameters can be accessed via process.env.<PARAMS>
*/
require("dotenv").config({ path: 'src/.env' });
const APP_PORT = process.env.PORT;
const APP_DB_URI = process.env.ATLAS_URI;

/*
    Connect to mongo database
*/
mongoose.connect(
    APP_DB_URI, 
    {useNewUrlParser: true, useUnifiedTopology: true} 
);
db = mongoose.connection;
db.once('open', () => console.log(app_constants.ATLAS_CONNECTION_ESTABLISHED)
).on('error', () => console.log(app_constants.ATLAS_CONNECTION_FAILURE)
).on('close', () => console.log(app_constants.ATLAS_CONNECTION_CLOSED)
).on('disconnected', () => console.log(app_constants.ATLAS_CONNECTION_LOST)
).on('reconnected', () => console.log(app_constants.ATLAS_CONNECTION_RE_ESTABLISHED));

/*
    Initilaizing an express application
*/
const app = express();

/*
    Setting up middlewares to the express application
*/
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());





/*
    Setting up console logging only for 4xx and 5xx responses
*/ 
app.use(morgan('dev', {
    skip: function(request, response) { return response.statusCode < 400 }
}));

/*
    Setting up file logging for all responses
        const fs = require("fs");
        app.use(morgan('common', {
            stream: fs.createWriteStream(path.join(__dirname, 'news-api-access.log'), { flags: 'a'})
        }));

        combined    -   :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
        common      -   :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
        dev         -   :method :url :status :response-time ms - :res[content-length]
        short       -   :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms
        tiny        -   :method :url :status :res[content-length] - :response-time ms
*/

app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length]', {
    stream: rfs.createStream('news-api-access.log', {
        interval: '7d',
        path: path.join(__dirname, 'log')
    })
}));

/*
    Setting up root endpoint
*/
app.get('/', (request, response) => {
    response.status(200).json({ message : "Welcome to News Aggregator API"});
});


/*
    Making use of custom routes in the express application
*/
app.use(routes);

routes.use(cors());
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

routes.use('/', auth);
routes.use('/preferences', pref);
routes.use('/news', news);

/*
    Setting up server to listen on a specific port
*/
app.listen(APP_PORT, (error) => {
    if (!error) {
        console.log(app_constants.MSG_SERVER_RUNNING, `${APP_PORT}`);
    } else {
        console.error(app_constants.MSG_SERVER_START_FAILURE, error);
    }
});

process.on('exit', function (){
    // connection.disconnect();
    redisClient.disconnect();
});

/*
    Export your application
*/
module.exports = app;