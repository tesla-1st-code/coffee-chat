import { User } from "../models/user";
import { createHmac } from 'crypto';
import { Types } from 'mongoose';

import * as uuidv4 from 'uuid/v4';

export class UserController {
    constructor() {}

    async findLogin(userName: string, password: string) {
         let user = await User.findOne({ userName: userName });

         if (!user)
            return null;

         let userHash = user.toJSON().hash
         let systemHash = createHmac('sha256', user.toJSON().salt).update(password).digest('hex');
         
         if (userHash !== systemHash)
            return null;

        return user.toJSON();
    }

    async findByUserName(userName: string) {
        let user = await User.findOne({ userName: userName });

        if (!user)
            return null;

        return user.toJSON();
    }

    async getContacts(userId: string) {
        return await User.findOne({ _id: Types.ObjectId(userId)}).populate('contacts.user');
    }

    async register(data: any) {
        try {
            let salt = uuidv4();
            let hash = createHmac('sha256', salt).update(data.password).digest('hex');
    
            let user = await User.create({
                userName: data.userName,
                salt: salt,
                hash: hash,
                profile: {
                    name: data.displayName
                },
                contacts: []
            });

            return { data: user.toJSON(), error: null };
        }
        catch(error) {
            return {data: null, error: error.message};
        }
    }
}