import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key (ensure it's in .env and NOT prefixed with NEXT_PUBLIC_)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the latest flash model
export const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-latest" 
});