import { GoogleGenerativeAI } from "@google/generative-ai";
import { errorHandler } from "./utility.js";

// Error messages object
const ERROR = {
  title: "Explaination Error",
  msg: "Failed to send data. Please try again or refresh the page.",
};

/**
 * Provides an explanation for the given text selection by breaking it down into simpler parts.
 *
 * @param {string} selection - The text to be explained.
 * @returns {Promise<string|null>} - The translated text or null if an error occurs.
 * @throws Will throw an error if the translation request fails.
 */

async function getExplaination(selection) {
  const prompt = `Break down (${selection}) into smaller, easier-to-understand parts. Use analogies and real-life examples to simplify the concept and make it more relatable.`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.API_key);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 0.7,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048, // Adjust as needed
    };

    const result = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text: `
                  ${prompt}
  
                  Generate a response in JSON format with the following structure:
                  {
                      "content": "Semantic HTML content in Arabic"
                  }
  
                  The "content" field should contain semantic HTML elements (e.g., <p>, <h1>, <h2>, <ul>, <li>, etc.) and should be written in Arabic.
                `,
            },
          ],
        },
      ],
      generationConfig,
    });

    const response = result.response;

    const text = response.text();
    // Clean the response and parse JSON
    const cleanedResponse = text.replace(/```json|```/g, "").trim();
    const responseData = JSON.parse(cleanedResponse);

    if (!responseData?.content) {
      throw new Error("Invalid response structure from API");
    }

    return responseData.content;
  } catch (error) {
    console.error(error);
    errorHandler(ERROR);
    return null;
  }
}

export default getExplaination;
