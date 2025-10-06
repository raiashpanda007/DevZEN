import { Router } from "express";
import { SendMessage } from "../controllers/message.controller";
const router: Router = Router();


router.post('/', SendMessage);


export default router