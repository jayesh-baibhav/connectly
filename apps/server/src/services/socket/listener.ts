import { Server } from 'socket.io';
import { pub } from '../redis';

export class SocketListener {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    public init() {
        this.io.on('connection', (socket) => {
            socket.on('join', ({ userId }: { userId: string }) => {
                if (!userId) {
                    console.log('Join event missing userId');
                    socket.emit('error', { message: 'User ID is required to join a room.' });
                    return;
                }
                console.log(`Socket Connected: ${socket.id}, User ID: ${userId}`);
                socket.join(userId);
            });

            socket.on('event:message', async ({ message }: { message: object }) => {
                console.log(`New Message Received: ${message}`);
                await pub.publish('MESSAGES', JSON.stringify(message ));
            });

            socket.on('disconnect', (reason) => {
                console.log(`Socket Disconnected: ${socket.id}, Reason: ${reason}`);
            });
        });
    }
}
