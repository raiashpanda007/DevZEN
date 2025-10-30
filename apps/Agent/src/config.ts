import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const OPENROUTER_KEY = process.env.OPENROUTER_KEY
const MCP_SERVER_URL = process.env.MCP_SERVER_URL
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const QDRANT_URL = process.env.QDRANT_URL
function validateConfig() {
  const required = {
    PORT,
    OPENROUTER_KEY,
    MCP_SERVER_URL,
    GEMINI_API_KEY,
    QDRANT_URL
  };
  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
  console.log("All required environment variables are set.");
}
validateConfig();

export default validateConfig
export {
    PORT,
    OPENROUTER_KEY,
    MCP_SERVER_URL,
    GEMINI_API_KEY,
    QDRANT_URL
}