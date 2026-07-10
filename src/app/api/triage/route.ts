import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client using the official @google/genai SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { scenario } = await request.json();

    // Safety guardrails to verify environment configurations
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    if (!scenario) {
      return NextResponse.json(
        { error: "No stadium scenario provided." },
        { status: 400 }
      );
    }

    // Call the Gemini model to triage the operational/security event
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an AI Stadium Operations Assistant for the 2026 World Cup. 
      Analyze the following safety/security scenario and provide a concise triage report 
      including: Severity Level (Low/Medium/High), Immediate Action Required, and Key Stakeholders to Alert.
      
      Scenario: ${scenario}`,
    });

    return NextResponse.json({ result: response.text });

  } catch (error: any) {
    console.error("Triage Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
