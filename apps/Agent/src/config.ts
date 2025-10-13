import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const OPENROUTER_KEY = process.env.OPENROUTER_KEY
const MCP_SERVER_URL = process.env.MCP_SERVER_URL
function validateConfig() {
  const required = {
    PORT,
    OPENROUTER_KEY,
    MCP_SERVER_URL
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
    MCP_SERVER_URL
}