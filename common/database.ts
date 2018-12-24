import * as mongoose from 'mongoose';

const ENV = require("../env.json")[process.env.NODE_ENV || "development"];

export let connect = () => {
    mongoose.connect(ENV["dsn"], { useNewUrlParser: true }, err => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Database is connected');
    });
}