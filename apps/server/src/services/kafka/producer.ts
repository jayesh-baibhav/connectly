import kafka from './index';
import { Producer } from "kafkajs";

let producer: Producer | null = null;

export async function createProducer() {
    if (producer) return producer;
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}

export async function produceMessage(message: string) {
    const producer = await createProducer();
    await producer.send({
        messages: [{ key: `message-${Date.now()}`, value: message }],
        topic: 'MESSAGES',
    });
    return true;
}
