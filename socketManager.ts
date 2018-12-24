import { Socket } from "socket.io";
import { UserController } from "./controllers/user";
import { AuthController } from "./controllers/auth";
import { RequestController } from "./controllers/request";

export class SocketManager {
    authController: AuthController;
    userController: UserController;
    requestController: RequestController;
    socket: Socket;

    constructor(_socket: Socket) {
        this.socket =_socket;
        this.authController = new AuthController();
        this.userController = new UserController();
        this.requestController = new RequestController();
    }

    setup() {
        this.socket.on('authorize', async () => {
            if (!this.socket.handshake['authorization'])
                await this.authorize(this.socket.handshake.query.auth);
        });

        this.socket.on('login', async data => {
            await this.login(data);
        });

        this.socket.on('logout', () => {

        });

        this.socket.on('register', async data => {
            await this.register(data);
        });

        this.socket.on('send-request', async data => {
            let authorized = await this.authorize(this.socket.handshake.query.auth);

            if (!authorized)
                return;

            await this.sendRequest(this.socket.handshake['authorization']['id'], data.id);
        });

        this.socket.on('findContact', async data => {
            let authorized = await this.authorize(this.socket.handshake.query.auth);

            if (!authorized)
                return;

            await this.findContact(data.query);
        });
    }

    async authorize(token) {
        if (!token) {
            this.socket.emit('unauthorized', {});
            return false;
        }

        let auth = await this.authController.findByToken(token);

        if (!auth) {
            this.socket.emit('unauthorized', {});
            return;
        }

        let identity = {
            id: auth.user._id,
            token: auth.token,
            userName: auth.user.userName,
            profile: auth.user.profile
        }

        this.socket.handshake['authorization'] = identity;
        this.socket.emit('authorized', identity);
        return true;
    }

    async login(data) {
        let login = await this.userController.findLogin(data.userName, data.password);

        if (!login) {
            this.socket.emit('login-error', {error: 'Login is not found'});
            return;
        }

        let auth = await this.authController.findByUserId(login._id);

        if (!auth) {
            auth = await this.authController.save(login._id, this.socket.handshake.address);
        }

        let identity = {
            token: auth.token,
            userName: login.userName,
            profile: login.profile
        }

        this.socket.emit('authorized', identity);
    }

    async register(data) {
        let result = await  this.userController.register(data);

        if (!result) {
            this.socket.emit('register-error', {error: result.error});
            return;
        }

        this.socket.emit('register-success', result.data);
    }

    async findContact(query: string) {
        let contact = await this.userController.findByUserName(query);
        let identity = null;

        if (contact) {
            identity = {
                id: contact._id,
                userName: contact.userName,
                profile: contact.profile
            };
        }
  
        this.socket.emit('result-contact', identity);
    }

    async sendRequest(senderId: string, recipientId: string) {
         let request = await this.requestController.findRequest(senderId, recipientId);

         if (!request)
             request = await this.requestController.sendRequest(senderId, recipientId);

         this.socket.emit('request-feed', request);
    }
}