import { Auth } from "../models/auth";
import { Types } from "mongoose";

import * as randToken from 'rand-token';

export class AuthController {
    constructor() {}

    async findByToken(token: string) {
        let auth = await Auth.findOne({ token: token, isActive: true }).populate('user').exec();

        if (auth) {
            return auth.toJSON();
        }

        return null;
    }

    async findByUserId(userId: string) {
        let auth = await Auth.findOne({ userId: Types.ObjectId(userId), isActive: true});

        if (auth) {
            return auth.toJSON();
        }

        return null;
    }

    async save(userId: string, ip: string) {
        let token = randToken.generate(32);

        let auth = await Auth.create({
            user: userId,
            token: token,
            date: new Date(),
            ipAddress: ip,
            isActive: true
        });

        return auth.toJSON();
    }
}