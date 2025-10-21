import { Router } from "express";
import { LLMRequest } from "../controllers/llm.controller";

const router: Router = Router();

router.post("/agent-request",LLMRequest);


export default router