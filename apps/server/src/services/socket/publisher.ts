import { Server } from 'socket.io';

export class SocketPublisher {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    public emitMessage(message: object) {
        this.io.emit('message', message);
    }
}
