import dotenv from 'dotenv'
import http from 'http'
import express from 'express'
import { startMessageConsumer } from './services/kafka/consumer'
import SocketService from './services/socket/index'
import chatRoutes from './module/chat/route'
import userRoutes from './module/user/route'

dotenv.config()
  
async function init(): Promise<void> { 

    const app = express();

    startMessageConsumer();

    app.use(express.json());

    app.use("/chat", chatRoutes);

    app.use("/user/user_created", express.raw({ type: "application/jwt" }));
    app.use("/user", userRoutes)

    const httpServer = http.createServer(app);

    const socketService = new SocketService();
    socketService.io.attach(httpServer);

    const PORT: number = parseInt(process.env.PORT || '8000', 10);
    httpServer.listen(PORT, () => {
        console.log(`HTTP Server Started @ PORT:${PORT}`);
    });

    socketService.start();
}

init().catch((error) => {
    console.error('Error during initialization:', error);
});
