import { sub } from './index';
import { produceMessage } from '../kafka/producer';
import { Server } from 'socket.io';

export async function subscribeToMessages(io: Server) {
    sub.subscribe("MESSAGES");
    sub.on("message", async (channel, message) => {
        if (channel == "MESSAGES") {
            console.log('New message from Redis', message);
            const receiverId = JSON.parse(message)?.receiverId
            io.to(receiverId).emit("message", message);
            // DB store
            await produceMessage(message);
            console.log("Message Produced to Kafka Broker");
        }
    });
}
