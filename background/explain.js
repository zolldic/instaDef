import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Provides an explanation for the given text selection by breaking it down into simpler parts.
 *
 * @async
 * @function getExplaination * @param {string} selection - The text to be explained. * @param {string} selection - The text to be translated.
 * @returns {Promise<string|null>} - The translated text or null if an error occurs.
 * @throws Will throw an error if the translation request fails.
 */

async function getExplaination(selection) {
  const prompt = `Break down (${selection}) into smaller, easier-to-understand parts. Use analogies and real-life examples to simplify the concept and make it more relatable.`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const res = await model.generateContent(prompt);
    return res.response.text();
  } catch (error) {
    console.error(error);
  }
}

export default getExplaination;
