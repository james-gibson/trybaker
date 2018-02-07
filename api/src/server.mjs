//@flow
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

import routes from './routes/index.mjs';

import http from 'http';
import type {DataProvider} from "./services/data/dataProvider.mjs";
import apiHandler from "./routes/ApiHandler.mjs";

const debug = console.log;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
const start = (dataProvider:DataProvider) => {
    var app = express();
    app.use(logger('dev'));
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use((req, res, next) => {
       req.custom = {
           dataProvider,
       };
       next();
    });

    app.use('/api', apiHandler);
    app.use('/', routes);



    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        next(err);
    });
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: err
            });
        });
    }
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: {}
        });
    });


    /**
     * Get port from environment and store in Express.
     */

    var port = 3000;
    app.set('port', port);

    /**
     * Create HTTP server.
     */

    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', console.log);
    server.on('listening', onListening(server));

    return app;
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = (server:*) => () =>{
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

class Server {
    constructor(dataProvider:DataProvider) {
        return start(dataProvider);
    }
}

export default Server;
