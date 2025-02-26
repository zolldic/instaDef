import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

chrome.runtime.onInstalled.addListener(async () => {
  // reload the extention automatically.
  chrome.commands.onCommand.addListener((shortcut) => {
    if (shortcut.includes("+Q")) {
      chrome.runtime.reload();
    }
  });

  // create a context menu
  chrome.contextMenus.create({
    id: "translate",
    title: "Translate (%s)",
    type: "normal",
    documentUrlPatterns: ["<all_urls>"],
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "explain",
    title: "Explain (%s)",
    type: "normal",
    documentUrlPatterns: ["<all_urls>"],
    contexts: ["selection"],
  });

  // inject the content script
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      if (tabs[0].url.includes("chrome://")) return undefined;

      await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"],
      });
    }
  );
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let data = null;

  if (info.menuItemId === "translate") {
    try {
      data = await getTranslation(info.selectionText);
    } catch (error) {
      console.error(error);
    }
  }

  if (info.menuItemId === "explain") {
    try {
      data = await getExplaination(info.selectionText);
    } catch (error) {
      console.error(error);
    }
  }

  // send the info to content script
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { data });
    }
  );
});

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
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
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

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Provides an explanation for the given text selection by breaking it down into simpler parts.
 *
 * @async
 * @function getExplaination * @param {string} selection - The text to be explained. * @param {string} selection - The text to be translated.
 * @returns {Promise<string|null>} - The translated text or null if an error occurs.
 * @throws Will throw an error if the translation request fails.
 */

async function getExplaination(selection) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Break down (${selection}) into smaller, easier-to-understand parts. Use analogies and real-life examples to simplify the concept and make it more relatable.`;
    const res = await model.generateContent(prompt);
    return res.response.text();
  } catch (error) {
    console.error(error);
  }
}

/**
async function saveToStorage(key , value): {
    if (value || key) {
      console.error("no text provided to save");
      return;
    }
  
    try {
      // retrive old data in the storage
      const oldData = await chrome.storage.local.get("data");
  
      // check if the there is entries in the sotrage
      // if not default to empty array
      const storage: storage = oldData.data
        ? { data: oldData.data }
        : { data: [] };
  
      // loop through the storage to store words under the document name
      // if the storage is empty then proceeds to adds new documents name and word
      if (storage.data.length > 0) {
        for (let entry of storage.data) {
          if (key === entry["title"]) {
            entry.words.push(value);
          } else {
            entry.title = key;
            entry.words.push(value);
          }
        }
      } else {
        storage.data.push({
          title: key,
          words: [value],
        });
      }
  
      // save changes to the storage api
      await chrome.storage.local.set({ data: storage.data });
  
      console.log(`saved ${key}, ${value} to storage`);
    } catch (error) {
      console.error(error);
    }
  }
  
async function getDefinition(selection) {
    if (selection) {
      console.error("Error: no word provided");
      return null;
    }
  
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  
    try {
      const response: Response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error(
        "Error error feching definition",
        error instanceof Error ? error.message : error
      );
    }
  } */
