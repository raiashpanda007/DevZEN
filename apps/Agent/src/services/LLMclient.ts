import { OPENROUTER_KEY } from "../config"
import OpenAI from "openai"


export const LLMClient = new OpenAI({apiKey:OPENROUTER_KEY,baseURL:"https://openrouter.ai/api/v1"})