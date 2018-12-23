import { Schema, model } from 'mongoose';

export let User = model('User', new Schema({ 
    userName: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    profile: {
        name: { type: String, required: true },
        status: { type: String, required: false },
        profilePath: { type: String, required: false }
    },
    contacts: [{userId: { type: Schema.Types.ObjectId, ref: 'User' }, roomId: String}]
}, {versionKey: false, collection: 'users'}));