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
            try {
                await prismaClient.message.create({
                    data: {
                        text: message.value?.toString()
                    }
                });
            } catch (err) {
                console.log('Something is wrong!');
                pause();
                setTimeout(() => { consumer.resume([{ topic: "MESSAGES" }]) }, 60 * 1000);
            }
        }
    });
}
