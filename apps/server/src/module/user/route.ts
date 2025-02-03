import { Router } from "express";
import { userCreated } from "./controller";

const router = Router();

router.post("/user_created", userCreated);

export default router;
