import kafka from './index';
import prismaClient from '../prisma';

export async function startMessageConsumer() {
    const consumer = kafka.consumer({ groupId: "default" });
    await consumer.connect();
    await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({ message, pause }) => {
            console.log('New Message Received');
            if (!message.value) return;
            const newMsg = JSON.parse(message.value?.toString())
            try {
                await prismaClient.message.create({
                    data: {
                        senderId: newMsg.senderId,
                        receiverId: newMsg.receiverId,
                        message: {
                            type: "TEXT",
                            content: newMsg.message
                        },
                        createdAt: new Date(newMsg.createdAt),
                      },
                });
            } catch (err) {
                console.log('Something is wrong!');
                pause();
                setTimeout(() => { consumer.resume([{ topic: "MESSAGES" }]) }, 60 * 1000);
            }
        }
    });
}
