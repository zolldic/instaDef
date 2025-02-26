import getTranslation from "./translation.js";
import getExplaination from "./explain.js";
import { getActiveTab, errorHandler } from "./utility.js";

// Menus object to store the menu items
const MENUS = {
  TRANSLATE: "translate",
  EXPLAIN: "explain",
};

// Error messages object
const ERRORS = {
  title: "Extension Error",
  msg: "Failed to send data. Please try again or refresh the page.",
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
      id: MENUS.TRANSLATE,
      title: "Translate (%s)",
    },
    {
      id: MENUS.EXPLAIN,
      title: "Explain (%s)",
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
      switch (info.menuItemId) {
        case MENUS.TRANSLATE:
          await getTranslation(info.selectionText);
          break;
        case MENUS.EXPLAIN:
          const data = await getExplaination(info.selectionText);
          await chrome.tabs.sendMessage(activeTab.id, { data });
          break;
      }
    }
  } catch (error) {
    console.error("Context menu action failed:", error);
    errorHandler(ERRORS);
  }
}

// Listen for the extension installation
chrome.runtime.onInstalled.addListener(async () => {
  setUpCommands();
  createContextMenu();
});

// Listen for menu clicks
chrome.contextMenus.onClicked.addListener(handleMenuClick);
