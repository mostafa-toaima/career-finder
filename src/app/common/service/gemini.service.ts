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

  async sendFormDataToGemini(formData: any): Promise<any> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `
    I am building a smart career advisor for university students. Please provide a detailed career analysis in the following exact JSON format:

    {
      "Recommended Career Path": "The most suitable career path",
      "Career Description": "Detailed description of why this path is suitable",
      "Why This Path Fits You": [
        "Reason 1",
        "Reason 2",
        "Reason 3"
      ],
      "Your Action Plan": [
        {
          "Timeline": "Timeframe",
          "ActionItems": [
            "Action 1",
            "Action 2"
          ]
        }
      ],
      "Pro Tips for Success": [
        "Tip 1",
        "Tip 2"
      ]
    }

    Base your analysis on these student details:
    - Faculty: ${formData.faculty}
    - Department: ${formData.department}
    - Favorite Subjects: ${formData.favoriteSubjects}
    - Strengths: ${formData.strengths}
    - Work Preference: ${formData.workPreference}
    - Work Environment: ${formData.environment}
    - Problem Solving: ${formData.problemSolving}
    - Study Willingness: ${formData.studyWillingness}
    - Research Interest: ${formData.researchInterest}
    - Task Style: ${formData.taskStyle}
    - Entrepreneurship: ${formData.entrepreneurship}
    - Career Goal: ${formData.goal}

    IMPORTANT: Return ONLY valid JSON in the specified format.
  `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;

      // Return both text and parsed JSON for better error handling
      const responseText = response.text();
      try {
        return JSON.parse(responseText);
      } catch (e) {
        // If parsing fails, return the text for manual parsing
        return responseText;
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
}
