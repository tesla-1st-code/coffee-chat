import { Schema, model } from 'mongoose';

export let Auth = model('Auth', new Schema({
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    isActive: { type: Boolean, default: false, required: true }
}, {versionKey: false, collection: 'auths'}));