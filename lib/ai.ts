import { GoogleGenerativeAI } from "@google/generative-ai";

let model: any = null;

export function getAIClient() {
  if (model) return model;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  return model;
}
