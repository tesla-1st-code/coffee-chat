import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as database from './common/database';
import * as http from 'http';
import * as socketIO from 'socket.io';
import * as siofu from 'socketio-file-upload';

import { SocketManager } from './socketManager';

const ENV = require("./env.json")[process.env.NODE_ENV || "development"];
const CORS = (req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type, Accept, X-Token');
    res.header('Access-Control-Allow-Origin', '*');
    next();
}

let app = express();
app.use(CORS);
app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb' , extended: false }));

let server = http.createServer(app);
let io = socketIO(server);

database.connect();

server.listen(ENV["port"]);

io.on('connection', socket => {
    let manager = new SocketManager(socket);
    manager.setup();
});