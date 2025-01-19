import { Server } from 'socket.io';
import { SocketListener } from './listener';
import { SocketPublisher } from './publisher';
import { subscribeToMessages } from '../redis/subscriber';

class SocketService {
    public io: Server;
    private listener: SocketListener;
    private publisher: SocketPublisher;

    constructor() {
        console.log('Initialized Socket Service');
        this.io = new Server({
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
                allowedHeaders: ['*'],
            },
        });
        this.listener = new SocketListener(this.io as Server);
        this.publisher = new SocketPublisher(this.io as Server);
    }

    public start() {
        this.listener.init();
        subscribeToMessages(this.io);
    }

    public getIo() {
        return this.io;
    }
}

export default SocketService;
