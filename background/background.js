import getDefintion from "./definition.js";
import { getActiveTab, errorHandler, tokenizer } from "./utility.js";

// Menus object to store the menu items
const MENUS = {
  DEFINE: "define",
};

// Error messages object
const ERRORS = {
  EXT_ERR: {
    title: "Extension Error",
    msg: "Failed to send data. Please try again or refresh the page.",
  },
  DEF_ERR: {
    title: "Selection Error",
    msg: "please select one word at a time",
  },
};

/**
 * Set up the commands
 * @returns {void}
 */

function setUpCommands() {
  chrome.commands.onCommand.addListener((shortcut) => {
    if (shortcut.includes("+Q")) {
      chrome.runtime.reload();
    }
  });
}

/**
 * Create the context menu items
 * @param {Object} menus - The menus object
 * @returns {void}
 */
function createContextMenu() {
  const options = [
    {
      id: MENUS.DEFINE,
      title: "Define (%s)",
    },
  ];

  // create the context menu items
  options.forEach((option) => {
    chrome.contextMenus.create({
      id: option.id,
      title: option.title,
      type: "normal",
      documentUrlPatterns: ["<all_urls>"],
      contexts: ["selection"],
    });
  });
}

/**
 * Inject the content script into the active tab
 * @param {Object} tab - The active tab
 * @returns {Promise<boolean>} - The promise that resolves to a boolean
 */

async function injectScript(tab) {
  // Check if the tab is a chrome:// page
  if (tab.url.includes("chrome://")) {
    return false;
  }
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
  return true;
}

/**
 * Handle the menu click
 * @param {Object} info - The menu info object
 * @returns {void}
 */
async function handleMenuClick(info) {
  try {
    // Get active tab
    const activeTab = await getActiveTab({ active: true, currentWindow: true });
    // Inject the content script into the active tab and handle the menu click
    if (await injectScript(activeTab)) {
      const selection = tokenizer(info.selectionText);
      const data = await getDefintion(selection);
      await chrome.tabs.sendMessage(activeTab.id, { data });
    }
  } catch (error) {
    console.error("Context menu action failed:", error);
    errorHandler(ERRORS.EXT_ERR);
  }
}

// Listen for the extension installation
chrome.runtime.onInstalled.addListener(async () => {
  setUpCommands();
  createContextMenu();
});

// Listen for menu clicks
chrome.contextMenus.onClicked.addListener(handleMenuClick);
