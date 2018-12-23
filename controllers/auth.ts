import { Auth } from "../models/auth";
import { Types } from "mongoose";

import * as randToken from 'rand-token';

export class AuthController {
    constructor() {}

    async findByToken(token: string) {
        return await Auth.findOne({ token: token });
    }

    async findByUserId(userId: string) {
        return await Auth.findOne({ userId: Types.ObjectId(userId)});
    }

    async save(userId: string, ip: string) {
        let token = randToken.generate(32);

        await Auth.create({
            userId: userId,
            token: token,
            date: new Date(),
            ipAddress: ip,
            isActive: true
        });

        return token;
    }
}