import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config";

export const EMBEDDING_CLIENT  =  new GoogleGenAI({apiKey:GEMINI_API_KEY,});