import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
import { Kafka } from "kafkajs";

dotenv.config()

const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKERS!],
    ssl: {
        ca: [fs.readFileSync(path.resolve(`${process.env.KAFKA_CA_PATH}`), "utf-8")],
    },
    sasl: {
        username: `${process.env.KAFKA_USERNAME}`,
        password: `${process.env.KAFKA_PASSWORD}`,
        mechanism: "plain",
    }
});

export default kafka;
