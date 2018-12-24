import { Request } from "../models/request";
import { Types } from 'mongoose';

export class RequestController {
    constructor() {}

    async findRequests(userId: string) {
        let requests = await Request.find({ recipientId: Types.ObjectId(userId)}).populate('sender');

        if (requests.length === 0)
            return [];

        return requests.map(e => e.toJSON());
    }

    async findRequest(senderId: string, recipientId: string) {
        let request = await Request.findOne({ recipientId: Types.ObjectId(recipientId), senderId: Types.ObjectId(senderId)})
            .populate('recipient')
            .populate('sender');

        if (!request)
            return null;

        return request.toJSON();
    }
    
    async sendRequest(senderId: string, recipientId: string) {
        let request = await Request.create({
            sender: Types.ObjectId(senderId),
            recipient: Types.ObjectId(recipientId),
            date: new Date()
        });

        return request;
    }
}