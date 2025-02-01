import { Router } from "express";
import { getRecentChats, getConversation } from "./controller";  // Ensure correct path
import authenticateUser from "../../middleware/auth";

const router = Router();

router.get("/", authenticateUser,getRecentChats );
router.get("/conversation", getConversation)

export default router;