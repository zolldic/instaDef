import { extractWordDefinitions } from "./utility.js";
import { DICT_KEY } from "../config.js";

/**
 * Fetches the definition of a given word from the dictionary API.
 *
 * @param {string} selection - The word to look up in the dictionary.
 * @returns {Promise<Object>} A promise that resolves to the word definitions.
 */

async function getDefintion(selection) {
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${selection}?key=${DICT_KEY}`
  );

  const jsonData = await response.json();

  const data = extractWordDefinitions(jsonData);
  return data;
}

export default getDefintion;
