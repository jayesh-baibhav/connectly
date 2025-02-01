import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
import { Kafka } from "kafkajs";

dotenv.config()

const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKERS!],
});

const admin = kafka.admin()

async function createTopicIfNotExists() {
  await admin.connect();

  const topics = await admin.listTopics();

  const topicsToCreate = [];

  if (!topics.includes('MESSAGES')) {
    topicsToCreate.push({
      topic: 'MESSAGES',
      numPartitions: 1,
      replicationFactor: 1,
    });
    console.log('Preparing to create topic "MESSAGES".');
  } else {
    console.log('Topic "MESSAGES" already exists.');
  }

  // if (!topics.includes('MESSAGES_DLQ')) {
  //   topicsToCreate.push({
  //     topic: 'MESSAGES_DLQ',
  //     numPartitions: 1,
  //     replicationFactor: 1,
  //   });
  //   console.log('Preparing to create topic "MESSAGES_DLQ".');
  // } else {
  //   console.log('Topic "MESSAGES_DLQ" already exists.');
  // }

  if (topicsToCreate.length > 0) {
    await admin.createTopics({ topics: topicsToCreate });
    console.log('Created topics:', topicsToCreate.map((t) => t.topic).join(', '));
  } else {
    console.log('No topics needed to be created.');
  }

  await admin.disconnect();
}

createTopicIfNotExists().catch(console.error);

export default kafka;
