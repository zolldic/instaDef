import getTranslation from "./translation.js";
import getExplaination from "./explain.js";
import { getActiveTab } from "./utility.js";

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
});

// listen for menu clicks
chrome.contextMenus.onClicked.addListener(async (info) => {
  // get active tab
  const activeTab = await getActiveTab({ active: true, currentWindow: true });

  // inject the content script
  if (activeTab.url.includes("chrom://")) {
    return;
  } else {
    await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      files: ["content.js"],
    });
    console.log("injecting content script");
  }

  let data = null;

  if (info.menuItemId === "translate") {
    try {
      data = await getTranslation(info.selectionText);
    } catch (error) {
      console.error(error);
      // handle error gracefully
    }
  }

  if (info.menuItemId === "explain") {
    try {
      data = await getExplaination(info.selectionText);
    } catch (error) {
      console.error(error);
      // handle error gracefully
    }
  }

  // send the info to content script
  try {
    await chrome.tabs.sendMessage(activeTab.id, { data });
  } catch (error) {
    console.error(`Error: communicating with content script ${error.message}`);
    // handle error gracefully
  }
});
