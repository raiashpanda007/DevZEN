import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
function validateConfig() {
  const required = {
    PORT
  };
  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
  console.log("All required environment variables are set.");
}

validateConfig();

export {
    PORT
}