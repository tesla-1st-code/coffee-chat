"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketManager {
    constructor(_io) {
        this.io = _io;
        this.sockets = [];
    }
    run() {
        this.io.on('connection', socket => {
            this.io.emit('handshake', socket.handshake);
        });
        this.io.on('handshake', data => {
            console.log(data);
        });
    }
    findSocket(id) {
        return this.sockets.filter(e => e.id === id)[0];
    }
}
exports.SocketManager = SocketManager;
//# sourceMappingURL=socketManger.js.map