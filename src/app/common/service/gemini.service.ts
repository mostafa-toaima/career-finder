import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI('AIzaSyAvSVWL2YJ3_LpG3Ke1R3AH3WaH3EWTBPc'); // 🔥 Replace with your Gemini API Key
  }

  async sendFormDataToGemini(formData: any): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `
                      I am building a smart career advisor for university students. Please act as a professional career guidance counselor and help analyze this student's input. Based on the following details, suggest:

                      1. A suitable career path or domain.
                      2. Reasons for this suggestion.
                      3. Any recommended next steps (like skills, certifications, or internships).
                      4. Optional advice to help the student make the most of their strengths and interests.

                      Here is the student's data:
                      - Faculty: ${formData.faculty}
                      - Department: ${formData.department}
                      - Favorite Subjects or Topics: ${formData.favoriteSubjects}
                      - Strengths: ${formData.strengths}
                      - Preferred Work Type: ${formData.workPreference}
                      - Preferred Work Environment: ${formData.environment}
                      - Enjoys Problem Solving: ${formData.problemSolving}
                      - Willing to Study Further or Get Certifications: ${formData.studyWillingness}
                      - Research Interest (0–10): ${formData.researchInterest}
                      - Task Style Preference: ${formData.taskStyle}
                      - Interested in Starting a Business: ${formData.entrepreneurship}
                      - Dream Job or Career Goal: ${formData.goal}

                      Be detailed, helpful, and motivating. Output should be structured with headings if possible.
                      `;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}
