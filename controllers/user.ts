import { User } from "../models/user";
import { createHmac } from 'crypto';
import { Types } from 'mongoose';

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

    async getContacts(userId: string) {
        return await User.findOne({ _id: Types.ObjectId(userId)}).populate('contacts.user');
    }
}