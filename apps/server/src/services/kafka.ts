import fs from 'fs'
import path from 'path';
import { Kafka, Producer } from "kafkajs";
import prismaClient from './prisma';

const kafka = new Kafka({
    brokers: ['kafka-102eac3f-baibhav-b28d.c.aivencloud.com:24806'],
    ssl: {
        ca: [fs.readFileSync(path.resolve('./ca.pem'), "utf-8")],
    },
    sasl: {
        username: 'avnadmin',
        password: 'AVNS_Mj_UWArzOCK97G75Mac',
        mechanism: "plain",
    }
})

let producer: null | Producer  = null


export async function createProducer() {
    if (producer) return producer

    const _producer = kafka.producer()
    await _producer.connect()
    producer = _producer
    return producer

}

export async function produceMessage(message: string){
    const producer = await createProducer()
    await producer.send({
        messages: [{key: `message-${Date.now()}`, value: message}],
        topic: 'MESSAGES',
    })
    return true
}

export async function startMessageConsumer(){
    const consumer =  kafka.consumer({groupId: "default"})
    await consumer.connect()
    await consumer.subscribe({topic: "MESSAGES", fromBeginning: true})

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({message, pause}) => {
            console.log(`New Message Recieved`)
            if (!message.value) return
            try {
                await prismaClient.message.create({
                    data: {
                        text: message.value?.toString()
                    }
                })
            } catch (err) {
                console.log('Something is Wrong!')
                pause()
                setTimeout(() => {consumer.resume([{topic: "MESSAGES"}])}, 60*1000)
            }
        }
    })
}

export default kafka