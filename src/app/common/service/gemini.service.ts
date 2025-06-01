import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CareerAdvisorService {
  private apiKey = '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'; // Replace with your OpenRouter API Key
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(private http: HttpClient) { }

  async sendFormData(formData: any): Promise<any> {
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

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: 'mistralai/mistral-7b-instruct', // You can choose other available models
      messages: [{ role: 'user', content: prompt }]
    };

    try {
      const response: any = await this.http.post(this.apiUrl, body, { headers }).toPromise();
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error communicating with OpenRouter:', error);
      throw error;
    }
  }
}
