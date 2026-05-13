process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import axios from "axios";

const apiKey = process.env.OPENAI_API_KEY;
console.log("🔑 OpenAI API Key loaded:", apiKey ? `${apiKey.substring(0, 5)}...` : "❌ NOT FOUND");
console.log("🌐 Using official OpenAI URL:", "https://api.openai.com/v1/chat/completions");

export interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  answer: string;
}

export interface LessonResponse {
  title: string;
  content: string;
  quiz: [QuizQuestion, QuizQuestion, QuizQuestion];
}

// Detect if text contains Hebrew
const isHebrewText = (text: string): boolean => {
  const hebrewRegex = /[\u0590-\u05FF]/g;
  return hebrewRegex.test(text);
};

export const generateLesson = async (topic: string, categoryName: string, subCategoryName: string): Promise<LessonResponse> => {
  console.log("📚 generateLesson called with:", { topic, categoryName, subCategoryName });
  
  const isHebrew = isHebrewText(topic) || isHebrewText(categoryName) || isHebrewText(subCategoryName);
  const languageInstructions = isHebrew 
    ? "Respond in Hebrew. All content including title, lesson content, and quiz questions/options must be in Hebrew."
    : "Respond in English. All content including title, lesson content, and quiz questions/options must be in English.";
  
  console.log("🌍 Detected language:", isHebrew ? "Hebrew" : "English");
  
  try {
    console.log("🔄 Calling OpenAI API via Axios...");
    
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an educational AI. Always respond with valid JSON only, no extra text. ${languageInstructions}`,
          },
          {
            role: "user",
            content: `Create a detailed lesson about "${topic}", which falls under the category of "${categoryName}" and the sub-category "${subCategoryName}".

Make sure the lesson is contextually accurate and relevant to this specific category and sub-category.

Return a JSON object with exactly this structure:
{
  "title": "lesson title",
  "content": "lesson content in markdown format with detailed explanations",
  "quiz": [
    {
      "question": "question text",
      "options": ["option A", "option B", "option C", "option D"],
      "answer": "the correct option text"
    }
  ]
}
The quiz array must contain exactly 3 questions that test understanding of the lesson content.`,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    console.log("✅ OpenAI API responded successfully");
    const raw = response.data.choices[0]?.message?.content ?? "{}";
    console.log("📄 Raw response (first 100 chars):", raw.substring(0, 100));
    
    const parsed = JSON.parse(raw) as LessonResponse;
    console.log("✅ Successfully parsed JSON response");
    return parsed;
  } catch (error: any) {
    console.error("❌ OpenAI API Error Details:");
    console.error("  - Message:", error.message);
    console.error("  - Code:", error.code);
    console.error("  - Response status:", error.response?.status);
    console.error("  - Response data:", error.response?.data);
    console.error("  - Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    throw error;
  }
};
