import { Schema, model } from 'mongoose';

export let Request = model('Request', new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    isAccepted: { type: Boolean, required: true, default: false },
    processed: { type: Boolean, required: true, default: false }
}, {versionKey: false, collection: 'requests'}));