import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
import { Kafka } from "kafkajs";

dotenv.config()

const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKERS!],
    // ssl: {
    //     ca: [fs.readFileSync(path.resolve(`${process.env.KAFKA_CA_PATH}`), "utf-8")],
    // },
    // sasl: {
    //     username: `${process.env.KAFKA_USERNAME}`,
    //     password: `${process.env.KAFKA_PASSWORD}`,
    //     mechanism: "plain",
    // }
});

const admin = kafka.admin()

async function createTopicIfNotExists() {
    await admin.connect();
  
    const topics = await admin.listTopics();
    if (!topics.includes('MESSAGES')) {
      await admin.createTopics({
        topics: [
          {
            topic: 'MESSAGES',
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
      console.log('Created topic "MESSAGES".');
    } else {
      console.log('Topic "MESSAGES" already exists.');
    }

    await admin.disconnect();
}

createTopicIfNotExists().catch(console.error);

export default kafka;
