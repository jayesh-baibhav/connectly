import { Request, Response } from "express";
import { chats,conversation} from "./mockData";

export const getRecentChats  = (req: Request, res: Response) => {
    res.json(chats);
};

export const getConversation = (req: Request, res: Response) => {
    res.json(conversation)
}


