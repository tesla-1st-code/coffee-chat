import { Socket, Server } from 'socket.io';
import { AuthController } from './controllers/auth';
import { UserController } from './controllers/user';

export class SocketManager {
    sockets: Socket[];
    io: Server;
    authController: AuthController;
    userController: UserController;

    constructor(_io: Server) {
        this.io = _io;
        this.authController = new AuthController();
        this.userController = new UserController();
        this.sockets = [];
    }

    run() {
        this.io.on('connection', async socket => {
            let auth = null;

            auth = await this.authorize(socket);

            if (!auth)
                return;

            socket.on('register', async data => {});

            socket.on('login', async data => {
                let token = await this.login(data.userName, data.password, socket.handshake.address);

                if (token) 
                    socket.handshake.query.auth = token;
         
                auth = await this.authorize(socket);
            });

            socket.on('getContacts', async () => {
                auth = await this.authorize(socket);

                if (!auth)
                    return;
                
                let user = await this.userController.getContacts(auth.userId);

                socket.emit('setContacts', user.toJSON().contacts)
            });
        });
    }

    async authorize(socket: Socket) {
        let auth = await this.authController.findByToken(socket.handshake.query.auth);

        if (!auth) {
            socket.emit('unauthorized', {});
            return null;
        }
        
        this.addOrReplaceSocket(socket);

        socket.emit('authorized', auth.toJSON());

        return auth.toJSON();
    }

    async login(userName: string, password: string, ipAddress: string) {
        let token = null;

        let user = await this.userController.findLogin(userName, password);

        if (!user)
           return token;

        let auth = await this.authController.findByUserId(user._id);

        if (!auth) {
            token = await this.authController.save(user._id, ipAddress);
        }
        else {
            token = auth.toJSON().token;
        }

        return token;
    }

    addOrReplaceSocket(socket: Socket) {
        let socketIndex = this.sockets.findIndex(e => e.handshake.query.auth === socket.handshake.query.auth);

        if (socketIndex > -1)
            this.sockets[socketIndex] = socket;
        else
            this.sockets.push(socket);
    }
}