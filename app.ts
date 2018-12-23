import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as routingControllers from 'routing-controllers';
import * as http from 'http';
import * as socketIO from 'socket.io';

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

routingControllers.useExpressServer(app, {
    routePrefix: ENV['api_url'],
    classTransformer: false,
    controllers: [__dirname + "/controllers/*.js"]
});

const connectDb = () => {
    mongoose.connect(ENV["dsn"], { useNewUrlParser: true }, err => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Database is connected');
    })
}
const run = () => {
    app.listen(ENV["server_port"], err => {
        if (err) {
            console.log(err);
            return;
        }
    
        console.log(`Coffee Chat server is running on ${ENV["server_port"]}`);
    });

    io.on('connection', () => {
        console.log('Socket is connected');
    });
}

connectDb();
run();