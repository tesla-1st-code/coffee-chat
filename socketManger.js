"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./controllers/auth");
const user_1 = require("./controllers/user");
class SocketManager {
    constructor(_io) {
        this.io = _io;
        this.authController = new auth_1.AuthController();
        this.userController = new user_1.UserController();
        this.sockets = [];
    }
    run() {
        this.io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            let auth = null;
            auth = yield this.authorize(socket);
            if (!auth)
                return;
            socket.on('register', (data) => __awaiter(this, void 0, void 0, function* () { }));
            socket.on('login', (data) => __awaiter(this, void 0, void 0, function* () {
                let token = yield this.login(data.userName, data.password, socket.handshake.address);
                if (token)
                    socket.handshake.query.auth = token;
                auth = yield this.authorize(socket);
            }));
            socket.on('getContacts', () => __awaiter(this, void 0, void 0, function* () {
                auth = yield this.authorize(socket);
                if (!auth)
                    return;
                let user = yield this.userController.getContacts(auth.userId);
                socket.emit('setContacts', user.toJSON().contacts);
            }));
        }));
    }
    authorize(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            let auth = yield this.authController.findByToken(socket.handshake.query.auth);
            if (!auth) {
                socket.emit('unauthorized', {});
                return null;
            }
            this.addOrReplaceSocket(socket);
            socket.emit('authorized', auth.toJSON());
            return auth.toJSON();
        });
    }
    login(userName, password, ipAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = null;
            let user = yield this.userController.findLogin(userName, password);
            if (!user)
                return token;
            let auth = yield this.authController.findByUserId(user._id);
            if (!auth) {
                token = yield this.authController.save(user._id, ipAddress);
            }
            else {
                token = auth.toJSON().token;
            }
            return token;
        });
    }
    addOrReplaceSocket(socket) {
        let socketIndex = this.sockets.findIndex(e => e.handshake.query.auth === socket.handshake.query.auth);
        if (socketIndex > -1)
            this.sockets[socketIndex] = socket;
        else
            this.sockets.push(socket);
    }
}
exports.SocketManager = SocketManager;
//# sourceMappingURL=socketManger.js.map