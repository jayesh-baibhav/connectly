import { Server } from 'socket.io';
import { pub } from '../redis';

export class SocketListener {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    public init() {
        this.io.on('connection', (socket) => {
            console.log(`New Socket Connected: ${socket.id}`);

            socket.on('event:message', async ({ message }: { message: string }) => {
                console.log(`New Message Received: ${message}`);
                // Publish this message to Redis
                await pub.publish('MESSAGES', JSON.stringify({ message }));
            });
        });
    }
}
