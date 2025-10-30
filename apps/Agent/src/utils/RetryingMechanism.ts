import { LLMClient } from "../services/LLMclient";
import { Response } from "openai/resources/responses/responses";

async function FetchWithRetry(fn: () => Promise<Response>, retries = 5, baseDelay = 1000) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            if (error.status === 429 || error.message.includes("rate")) {
                const delay = baseDelay * Math.pow(2, i) + Math.random() * 500;
                console.warn(`Rate limited. Retrying in ${delay.toFixed(0)}ms...`);
                await new Promise(res => setTimeout(res, delay));
            } else if (i === retries) {
                throw error;
            } else {
                console.warn(`Attempt ${i + 1} failed, retrying...`);
                await new Promise(res => setTimeout(res, baseDelay));
            }

        }
    }
}

export default FetchWithRetry;