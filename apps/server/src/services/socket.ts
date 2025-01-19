import { Server } from "socket.io"
import Redis from "ioredis";
import {produceMessage} from './kafka'

const pub = new Redis({
    host: 'valkey-2e6687cb-baibhav-b28d.c.aivencloud.com',
    port: 24793,
    username: 'default',
    password: 'AVNS_9yLXQ2l7WhK4KuONoU3'
})
const sub = new Redis({
    host: 'valkey-2e6687cb-baibhav-b28d.c.aivencloud.com',
    port: 24793,
    username: 'default',
    password: 'AVNS_9yLXQ2l7WhK4KuONoU3'
})

class SocketServie {
    private _io: Server;

    constructor(){
        console.log("Initialized Socket Service")
        this._io = new Server({
            cors: {
                origin: '*', // Allow all origins, or specify specific origins
                methods: ['GET', 'POST'],
                allowedHeaders: ['*'],
            }
        })
        sub.subscribe("MESSAGES")
    }
    
    public initListeners() {
        const io = this.io
        console.log("Initialized Socket Listeners")
        io.on("connect", (socket) => {
            console.log(`New Socket Connected`, socket.id)
            socket.on('event:message', async ({ message }: { message: string }) => {
                console.log(`New Message Received`, message);
                // publish this msg to valkey
                await pub.publish("MESSAGES", JSON.stringify({message}))
            });            
        })

        sub.on("message", async (channel,message) => {
            if(channel=="MESSAGES"){
                console.log('new message from valkey', channel, message)
                io.emit("message",message)
                //  DB Store
                await produceMessage(message)
                console.log("Message Produced to Kafka Broker")
            }
        })
    }

    get io(){
        return this._io
    }
}

export default SocketServie;