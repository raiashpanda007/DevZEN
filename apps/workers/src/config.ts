import dotenv from "dotenv";

dotenv.config();

const QDRANT_URL = process.env.QDRANT_URL;
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
function validateConfig() {
    const required = {
        QDRANT_URL,
        HOST,
        PORT,
        GEMINI_API_KEY
    };
    for (const [key, value] of Object.entries(required)) {
        console.log("KEY :: ", key, "VALUE :: ", value);
        if (!value) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    }
    console.log("All required environment variables are set.");
}

validateConfig();


export {
    QDRANT_URL,
    HOST,
    PORT,
    GEMINI_API_KEY
}