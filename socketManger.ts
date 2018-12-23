import { Socket, Server } from 'socket.io';

export class SocketManager {
    sockets: Socket[];
    io: Server

    constructor(_io: Server) {
        this.io = _io;
        this.sockets = [];
    }

    run() {
        this.io.on('connection', socket => {
            this.io.emit('handshake',  socket.handshake);
        });

        this.io.on('handshake', data => {
            console.log(data);
        });
    }

    findSocket(id: string) {
        return this.sockets.filter(e => e.id === id)[0];
    }
}