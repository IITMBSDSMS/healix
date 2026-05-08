"use server";

import { GoogleGenAI } from "@google/genai";

// Simulated save to DB
export async function saveSymptomCase(symptoms: string[], action: string) {
  // In a real app, save to Supabase
  console.log("Saving symptom case:", symptoms, action);
  return { success: true };
}

export async function analyzeSymptomsAI(symptoms: string[]) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY") {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a medical triage AI for the Healix Healthcare Platform.
A user has reported the following symptoms: ${symptoms.join(", ")}.

Your task is to analyze these symptoms and provide preliminary guidance.
Do not provide a definitive medical diagnosis. Provide an action, recommend a service, and classify the severity.

Return the result STRICTLY as a JSON object with the following schema:
{
  "action": "A short, clear sentence of advice (e.g., 'Seek immediate emergency medical attention.' or 'Rest and stay hydrated.')",
  "service": "The recommended Healix service (e.g., 'Emergency SOS / Hospital Visit', 'General Physician', 'Home Care & Pharmacy')",
  "type": "Must be exactly one of: 'emergency', 'doctor', or 'rest'"
}

Only return the JSON. No markdown formatting or extra text.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const responseText = response.text || "";
      // Strip potential markdown JSON formatting
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const result = JSON.parse(cleanJson);
      
      // Save the case
      await saveSymptomCase(symptoms, result.action);

      return { result };
    } catch (error) {
      console.error("Gemini AI Error:", error);
      // Fallback to mock logic below if API fails
    }
  }

  // --- ROBUST FALLBACK/MOCK PIPELINE ---
  // If no API key or API fails, use a robust rule-based NLP simulator
  
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency
  
  const lowercaseSymptoms = symptoms.map(s => s.toLowerCase());
  let analysisResult: { action: string, service: string, type: 'emergency' | 'doctor' | 'rest' };

  const emergencyKeywords = ["chest pain", "shortness of breath", "difficulty breathing", "severe pain", "bleeding", "unconscious", "stroke", "heart", "choking"];
  const doctorKeywords = ["fever", "cough", "infection", "rash", "vomiting", "diarrhea", "swelling", "lump", "persistent", "chronic"];

  if (lowercaseSymptoms.some(s => emergencyKeywords.some(kw => s.includes(kw)))) {
    analysisResult = {
      type: 'emergency',
      action: "Based on the severity of your symptoms, seek immediate emergency medical attention.",
      service: "Emergency SOS / Hospital Visit"
    };
  } else if (lowercaseSymptoms.some(s => doctorKeywords.some(kw => s.includes(kw)))) {
    analysisResult = {
      type: 'doctor',
      action: "Your symptoms indicate you should consult a doctor for a proper diagnosis and treatment plan.",
      service: "General Physician"
    };
  } else {
    analysisResult = {
      type: 'rest',
      action: "Get plenty of rest and stay hydrated. Monitor your symptoms and consult a doctor if they worsen.",
      service: "Home Care & Pharmacy"
    };
  }

  await saveSymptomCase(symptoms, analysisResult.action);
  return { result: analysisResult };
}
