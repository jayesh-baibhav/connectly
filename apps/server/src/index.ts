import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import dotenv from 'dotenv'
import SocketService from './services/socket/index';
import { startMessageConsumer } from './services/kafka/consumer';
import { setupKinde, protectRoute, getUser, GrantType } from '@kinde-oss/kinde-node-express';
import {config} from './kindeConfig'

declare global {
    namespace Express {
      interface Request {
        user?: {
          id: string;
          email: string;
          given_name: string;
          family_name: string;
          roles: string[];
          permissions: string[];
        };
      }
    }
}

dotenv.config()
  
async function init(): Promise<void> {

    interface CustomSession {
        access_token?: string;
    }
      
    interface CustomRequest extends Request {
        session?: CustomSession;
    }

    const fetchUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        try {
          await getUser(req, res, next);
          next();
        } catch (error) {
          console.error("Error fetching user:", error);
          res.status(500).send("Error fetching user information");
        }
    };
      
    startMessageConsumer();

    const app = express();
    app.use(express.json());
    setupKinde(config,app)

    app.get("/", (req: CustomRequest, res: Response) => {
        if (req.session && req.session.access_token) {
            res.send(`You are authenticated!, {${req.session.access_token}}`);
        } else {
            res.send("You are not");
        }
    });

    app.get("/admin", protectRoute, (req, res) => {
        res.send("Welcome to the admin area");
    });

    app.get("/api/user", protectRoute, fetchUserMiddleware, (req: Request, res: Response) => {
        const user = req.user; // User is attached to req.user by Kinde middleware
        res.json({
          message: "Authenticated user information",
          user,
        });
    });
      
        
    app.post('/api/message', protectRoute, (req: Request, res: Response) => {
        const { message } = req.body;
        console.log(`Received message: ${message}`);
        res.status(200).send({ status: 'Message received', message });
    });

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
