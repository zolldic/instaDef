import axios from "axios";
import { errorHandler } from "./utility.js";
/**
 * Translates the given text selection from the source language to the target language.
 *
 * @async
 * @function getTranslation
 * @param {string} selection - The text to be translated.
 * @returns {Promise<string|null>} - The translated text or null if an error occurs.
 * @throws Will throw an error if the translation request fails.
 */

async function getTranslation(selection) {
  const source_lang = "en";
  const target_lang = "ar";

  const options = {
    method: "POST",
    url: "https://google-translator9.p.rapidapi.com/v2",
    headers: {
      "x-rapidapi-key": "517bf34bc9msh0a76e8027918c51p16e3f8jsn4f3d35143590",
      "x-rapidapi-host": "google-translator9.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      q: selection,
      source: source_lang,
      target: target_lang,
      format: "text",
    },
  };

  try {
    const response = await axios.request(options);

    const translattion = response.data.data.translations[0].translatedText;
    chrome.notifications.create("Success", {
      type: "basic",
      iconUrl: "./icons/error.png",
      title: "translation",
      message: translattion,
    });
  } catch (error) {
    console.error(error);
    errorHandler({
      title: "Translation Error",
      msg: "Failed to translate the text. Please try again.",
    });
  }
}

export default getTranslation;
